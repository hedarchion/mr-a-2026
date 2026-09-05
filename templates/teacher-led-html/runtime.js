(() => {
  "use strict";
  const deck = JSON.parse(document.getElementById("deck-data").textContent),
    stage = document.getElementById("stage"),
    slide = document.getElementById("slide");
  const [w, h] = (deck.viewport || "1366x768").split("x").map(Number);
  stage.style.width = w + "px";
  stage.style.height = h + "px";
  let index = 0;
  const states = deck.slides.map(() => ({
    hint: false,
    revealed: false,
    step: 0,
    selected: null,
    order: [],
    groups: {},
  }));
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const button = (text, fn, selected = false) => {
    const n = el("button", text, selected ? "selected" : "");
    n.type = "button";
    n.setAttribute("aria-pressed", String(selected));
    n.onclick = fn;
    return n;
  };
  function draw() {
    const focused = document.activeElement;
    const focusIndex = [...slide.querySelectorAll("button")].indexOf(focused);
    const s = deck.slides[index],
      st = states[index];
    slide.style.setProperty("--text-expansion", "1");
    slide.replaceChildren();
    slide.className = ["prompt", "reveal"].includes(s.type)
      ? "prompt-only"
      : "";
    slide.dataset.id = s.id;
    slide.dataset.type = s.type;
    slide.setAttribute("aria-label", s.prompt);
    slide.append(el("h1", s.prompt));
    const add = (tag, text, cls) => {
      const n = el(tag, text, cls);
      slide.append(n);
      return n;
    };
    if (s.type === "cloze") {
      const n = add("p", undefined, "hero");
      const [a, b] = s.sentence.split("{{blank}}");
      const blankText = st.revealed ? s.answer : st.selected || "_____";
      n.append(
        document.createTextNode(a),
        el("span", blankText, blankText === "_____" ? "blank empty" : "blank"),
        document.createTextNode(b),
      );
    }
    if (s.type === "gap") {
      const n = add("p", undefined, "passage");
      const [a, b] = s.text.split("{{blank}}");
      const blankText = st.revealed ? s.answer : st.selected || "_____";
      n.append(
        document.createTextNode(a),
        el("span", blankText, blankText === "_____" ? "blank empty" : "blank"),
        document.createTextNode(b),
      );
    }
    if (["choice", "cloze", "gap"].includes(s.type)) {
      const n = add("div", undefined, "choices");
      s.options.forEach((o) =>
        n.append(
          button(
            o,
            () => {
              st.selected = o;
              st.revealed = false;
              draw();
              focusChoice(o);
            },
            st.selected === o,
          ),
        ),
      );
    }
    if (s.type === "compare") {
      const n = add("div", undefined, "compare");
      s.columns.forEach((c) => {
        const col = el("div");
        col.append(el("p", c.label, "label"), el("p", c.text, "body"));
        n.append(col);
      });
    }
    if (s.type === "passage") add("p", s.text, "passage");
    if (s.type === "writing") {
      add("p", s.task, "body");
      if (st.revealed && s.frame) add("p", s.frame, "answer");
    }
    if (s.type === "image") {
      const n = add("img", undefined, "picture");
      n.src = s.src;
      n.alt = s.alt;
    }
    if (s.type === "steps") {
      const n = add("div", undefined, "list");
      s.items
        .slice(0, Math.max(1, st.step + 1))
        .forEach((t, i) => n.append(el("p", `${i + 1}. ${t}`, "step")));
    }
    if (s.type === "order") {
      const n = add("div", undefined, "list");
      const display = s.items.map((_, i) => i);
      if (!st.revealed) display.reverse();
      display.forEach((i) => {
        const pos = st.order.indexOf(i);
        n.append(
          button(
            `${pos < 0 ? "○" : pos + 1 + "."} ${s.items[i]}`,
            () => {
              if (st.revealed) return;
              st.order =
                pos < 0 ? [...st.order, i] : st.order.filter((x) => x !== i);
              draw();
            },
            pos >= 0,
          ),
        );
      });
      if (st.revealed)
        n.querySelectorAll("button").forEach((b) => (b.disabled = true));
    }
    if (s.type === "sort") {
      const n = add("div", undefined, "list");
      s.items.forEach((item, i) => {
        const row = el("div", undefined, "sort-row"),
          choices = el("div", undefined, "choices");
        row.append(el("span", item.text));
        choices.setAttribute("role", "group");
        choices.setAttribute("aria-label", item.text);
        s.categories.forEach((c) =>
          choices.append(
            button(
              c,
              () => {
                st.groups[i] = c;
                st.revealed = false;
                draw();
              },
              st.groups[i] === c,
            ),
          ),
        );
        if (st.revealed)
          choices.querySelectorAll("button").forEach((b) => {
            if (b.getAttribute("aria-pressed") === "true")
              b.textContent = "✓ " + b.textContent;
          });
        row.append(choices);
        n.append(row);
      });
    }
    if (st.hint && s.hint && !st.revealed) add("p", s.hint, "hint");
    if (st.revealed) {
      if (["reveal", "choice"].includes(s.type)) add("p", s.answer, "answer");
      if (s.feedback) {
        const f = add("p", s.feedback, "feedback");
        f.setAttribute("role", "status");
      }
    }
    expandContent(s.type);
    const hint = document.getElementById("hint"),
      rev = document.getElementById("reveal");
    hint.hidden = !s.hint;
    hint.disabled = st.revealed;
    hint.textContent = st.hint ? "Hide hint" : "Hint";
    rev.hidden = !(
      ["reveal", "choice", "cloze", "gap", "steps", "order", "sort"].includes(
        s.type,
      ) ||
      (s.type === "writing" && s.frame)
    );
    rev.textContent = s.type === "steps" ? "Next step" : "Reveal";
    rev.disabled =
      s.type === "steps" ? st.step >= s.items.length - 1 : st.revealed;
    document.getElementById("reset").hidden = hint.hidden && rev.hidden;
    document.getElementById("prev").disabled = index === 0;
    document.getElementById("next").disabled = index === deck.slides.length - 1;
    document.getElementById("count").textContent =
      `${index + 1} / ${deck.slides.length}`;
    if (focusIndex >= 0) slide.querySelectorAll("button")[focusIndex]?.focus();
    document.getElementById("announcement").textContent =
      `Slide ${index + 1} of ${deck.slides.length}. ${s.prompt}. ` +
      (st.revealed
        ? (s.answer || "") + " " + (s.feedback || "")
        : st.hint
          ? s.hint || ""
          : st.selected || "");
  }
  // Enlarge sparse content to use the classroom canvas. Never shrink below
  // the shared projection type scale; oversized content must be split in JSON.
  function expandContent(type) {
    if (type === "image") return;
    const fits = () => {
      const bounds = slide.getBoundingClientRect();
      const ratio = bounds.width / slide.offsetWidth;
      const style = getComputedStyle(slide);
      const top = bounds.top + parseFloat(style.paddingTop) * ratio;
      const bottom = bounds.bottom - parseFloat(style.paddingBottom) * ratio;
      const left = bounds.left + parseFloat(style.paddingLeft) * ratio;
      const right = bounds.right - parseFloat(style.paddingRight) * ratio;
      return [...slide.querySelectorAll("*")].every((node) => {
        const r = node.getBoundingClientRect();
        return (
          (!r.width && !r.height) ||
          (r.top >= top - 1 &&
            r.bottom <= bottom + 1 &&
            r.left >= left - 1 &&
            r.right <= right + 1 &&
            node.scrollWidth <= node.clientWidth + 1)
        );
      });
    };
    let low = 1,
      high = type === "prompt" || type === "reveal" ? 1.4 : 1.25;
    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      slide.style.setProperty("--text-expansion", mid);
      if (fits()) low = mid;
      else high = mid;
    }
    slide.style.setProperty("--text-expansion", low.toFixed(3));
  }
  function focusChoice(text) {
    [...slide.querySelectorAll("button")]
      .find((n) => n.textContent === text)
      ?.focus();
  }
  function reveal() {
    const s = deck.slides[index],
      st = states[index];
    if (s.type === "steps") st.step = Math.min(st.step + 1, s.items.length - 1);
    else {
      st.revealed = true;
      st.hint = false;
      if (["choice", "cloze", "gap"].includes(s.type)) st.selected = s.answer;
      if (s.type === "sort")
        s.items.forEach((x, i) => (st.groups[i] = x.category));
      if (s.type === "order") st.order = s.items.map((_, i) => i);
    }
    draw();
  }
  function move(n) {
    index = Math.max(0, Math.min(deck.slides.length - 1, index + n));
    draw();
  }
  document.getElementById("hint").onclick = () => {
    states[index].hint = !states[index].hint;
    draw();
  };
  document.getElementById("reveal").onclick = reveal;
  document.getElementById("reset").onclick = () => {
    states[index] = {
      hint: false,
      revealed: false,
      step: 0,
      selected: null,
      order: [],
      groups: {},
    };
    draw();
  };
  document.getElementById("prev").onclick = () => move(-1);
  document.getElementById("next").onclick = () => move(1);
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    } else if (
      e.code === "Space" &&
      !e.target.closest("button,input,textarea,select")
    ) {
      e.preventDefault();
      move(1);
    }
  });
  function scale() {
    const z = Math.min(innerWidth / w, innerHeight / h);
    stage.style.transform = `scale(${z})`;
    stage.style.left = (innerWidth - w * z) / 2 + "px";
    stage.style.top = (innerHeight - h * z) / 2 + "px";
  }
  addEventListener("resize", scale);
  scale();
  draw();
})();
