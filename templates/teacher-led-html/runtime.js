(() => {
  "use strict";
  const deck = JSON.parse(document.getElementById("deck-data").textContent),
    stage = document.getElementById("stage"),
    slide = document.getElementById("slide");
  const [w, h] = (deck.viewport || "1366x768").split("x").map(Number);
  stage.style.width = w + "px";
  stage.style.height = h + "px";
  let index = 0;
  const responseLog = new Map();
  const states = deck.slides.map(() => ({
    hint: false,
    revealed: false,
    step: 0,
    selected: null,
    order: [],
    groups: {},
    mix: {},
  }));
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const button = (text, fn, selected = false, result = "") => {
    const classes = [selected ? "selected" : "", result].filter(Boolean);
    const n = el("button", text, classes.join(" "));
    n.type = "button";
    n.setAttribute("aria-pressed", String(selected));
    if (result) n.dataset.result = result;
    n.onclick = fn;
    return n;
  };
  function recordChoice(sourceIndex, option) {
    const source = deck.slides[sourceIndex];
    states[sourceIndex].selected = option;
    responseLog.set(source.id, {
      slideId: source.id,
      slideNumber: sourceIndex + 1,
      prompt: source.prompt,
      response: option,
      responseType: "teacher-recorded-spoken-choice",
      recordedAt: new Date().toISOString(),
    });
  }
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
    const add = (tag, text, cls) => {
      const n = el(tag, text, cls);
      slide.append(n);
      return n;
    };
    if (s.label) add("p", s.label, "question-label");
    slide.append(el("h1", s.prompt));
    if (s.instruction) add("p", s.instruction, "instruction");
    if (s.stimulus) add("p", s.stimulus, "stimulus");
    if (s.visual && s.type !== "diagnostic") {
      const meta = add("div", undefined, "diagnostic-meta");
      const mark = el("img", undefined, "diagnostic-mark");
      mark.src = s.visual.src;
      mark.alt = s.visual.alt || "";
      mark.setAttribute("aria-hidden", "true");
      meta.append(mark, el("span", s.visual.instruction || "", "diagnostic-instruction"));
    }
    if (s.type === "review") {
      const intro = add("p", "Check the recorded answers. Click an option to change it, then export the JSON.", "diagnostic-instruction");
      const reviewGrid = add("div", undefined, "review-grid");
      s.reviewIds.forEach((id) => {
        const sourceIndex = deck.slides.findIndex((candidate) => candidate.id === id);
        const source = deck.slides[sourceIndex];
        if (!source) return;
        const row = el("div", undefined, "review-item");
        row.append(el("span", `${source.id.replace("q-", "")}.`, "review-number"));
        if (source.options) {
          const current = states[sourceIndex].selected;
          const currentIndex = current ? source.options.indexOf(current) : -1;
          row.append(button(`${current ? `Recorded: ${current}` : "No response"}`, () => {
            recordChoice(sourceIndex, source.options[(currentIndex + 1) % source.options.length]);
            draw();
          }, Boolean(current)));
        } else {
          row.append(el("span", states[sourceIndex].selected || "paper response", "review-paper"));
        }
        reviewGrid.append(row);
      });
    }
    if (s.type === "diagnostic") {
      const header = add("div", undefined, "diagnostic-meta");
      if (s.visual) {
        const mark = el("img", undefined, "diagnostic-mark");
        mark.src = s.visual.src;
        mark.alt = s.visual.alt || "";
        mark.setAttribute("aria-hidden", "true");
        header.append(mark);
      }
      header.append(el("span", s.visual?.instruction || "Answer on paper. Do not call out answers yet.", "diagnostic-instruction"));
      const grid = add("div", undefined, "diagnostic-grid");
      s.sections.forEach((section) => {
        const col = el("section", undefined, "diagnostic-section");
        col.append(el("h2", section.heading, "diagnostic-heading"));
        section.items.forEach((item) => {
          const row = el("div", undefined, "diagnostic-item");
          row.append(el("div", `${item.id}. ${item.prompt}`, "diagnostic-prompt"));
          if (item.options) row.append(el("div", item.options.map((o, i) => `${String.fromCharCode(65 + i)} ${o}`).join("   "), "diagnostic-options"));
          if (st.revealed) row.append(el("div", `Answer: ${item.answer}`, "diagnostic-answer"));
          col.append(row);
        });
        grid.append(col);
      });
    }
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
      s.options.forEach((o) => {
        const selected = st.selected === o;
        const result = deck.mode === "answering" ? "" : st.revealed
          ? o === s.answer
            ? "correct"
            : selected
              ? "incorrect"
              : ""
          : "";
        const label = deck.mode === "answering" && selected
          ? `Selected — ${o}`
          :
          result === "correct"
            ? `✓ Correct — ${o}`
            : result === "incorrect"
              ? `✕ Incorrect — ${o}`
              : o;
        n.append(
          button(
            label,
            () => {
              if (st.revealed) return;
              st.selected = o;
              if (deck.mode === "answering") recordChoice(index, o);
              draw();
              if (deck.mode !== "answering") focusChoice(o);
            },
            selected,
            result,
          ),
        );
      });
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
      if (st.revealed) {
        const correct =
          st.order.length === s.items.length &&
          st.order.every((itemIndex, position) => itemIndex === position);
        const attempt = el("div", undefined, `order-result ${correct ? "correct" : "incorrect"}`);
        attempt.append(
          el("p", correct ? "✓ Correct order" : "✕ Incorrect order", "result-status"),
          el(
            "p",
            st.order.length
              ? st.order.map((itemIndex, position) => `${position + 1}. ${s.items[itemIndex]}`).join("  ")
              : "No order selected",
            "result-sequence",
          ),
        );
        n.append(attempt);
        if (!correct) {
          const canonical = el("div", undefined, "order-result correct");
          canonical.append(
            el("p", "✓ Correct order", "result-status"),
            el(
              "p",
              s.items.map((item, position) => `${position + 1}. ${item}`).join("  "),
              "result-sequence",
            ),
          );
          n.append(canonical);
        }
      } else {
        const display = s.items.map((_, i) => i).reverse();
        display.forEach((i) => {
          const pos = st.order.indexOf(i);
          n.append(
            button(
              `${pos < 0 ? "○" : pos + 1 + "."} ${s.items[i]}`,
              () => {
                st.order =
                  pos < 0 ? [...st.order, i] : st.order.filter((x) => x !== i);
                draw();
              },
              pos >= 0,
            ),
          );
        });
      }
    }
    if (s.type === "sort") {
      const n = add("div", undefined, "list");
      s.items.forEach((item, i) => {
        const row = el("div", undefined, "sort-row"),
          choices = el("div", undefined, "choices");
        row.append(el("span", item.text));
        choices.setAttribute("role", "group");
        choices.setAttribute("aria-label", item.text);
        s.categories.forEach((c) => {
          const selected = st.groups[i] === c;
          const result = st.revealed
            ? c === item.category
              ? "correct"
              : selected
                ? "incorrect"
                : ""
            : "";
          const label =
            result === "correct"
              ? `✓ Correct — ${c}`
              : result === "incorrect"
                ? `✕ Incorrect — ${c}`
                : c;
          choices.append(
            button(
              label,
              () => {
                if (st.revealed) return;
                st.groups[i] = c;
                draw();
              },
              selected,
              result,
            ),
          );
        });
        row.append(choices);
        n.append(row);
      });
    }
    if (s.type === "wordmix") {
      const reference = add("div", undefined, "wordmix-reference");
      s.pairs.forEach((pair) => {
        const selected = st.mix.word === pair.word;
        const row = el("div", undefined, "wordmix-row");
        row.append(
          button(
            pair.word,
            () => {
              st.mix.word = st.mix.word === pair.word ? null : pair.word;
              draw();
            },
            selected,
          ),
          el("span", pair.meaning),
        );
        reference.append(row);
      });
      const builder = add("div", undefined, "wordmix-builder");
      const ideaChoices = el("div", undefined, "wordmix-ideas");
      ideaChoices.setAttribute("role", "group");
      ideaChoices.setAttribute("aria-label", "Ideas");
      s.ideas.forEach((idea) => {
        ideaChoices.append(
          button(
            idea,
            () => {
              st.mix.idea = st.mix.idea === idea ? null : idea;
              draw();
            },
            st.mix.idea === idea,
          ),
        );
      });
      const selection = el(
        "p",
        `${st.mix.word || "Choose a word"} + ${st.mix.idea || "choose an idea"}`,
        "wordmix-selection",
      );
      selection.setAttribute("aria-live", "polite");
      builder.append(ideaChoices, selection, el("p", s.frame, "wordmix-frame"));
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
    rev.hidden = deck.mode === "answering" || !(
      ["reveal", "choice", "cloze", "gap", "steps", "order", "sort", "diagnostic"].includes(
        s.type,
      ) ||
      (s.type === "writing" && s.frame)
    );
    rev.textContent = s.type === "steps" ? "Next step" : "Reveal";
    rev.disabled =
      s.type === "steps" ? st.step >= s.items.length - 1 : st.revealed;
    document.getElementById("reset").hidden =
      deck.mode !== "answering" && hint.hidden && rev.hidden && s.type !== "wordmix";
    const exportButton = document.getElementById("export-json");
    exportButton.hidden = deck.mode !== "answering" || s.type !== "review";
    exportButton.textContent = deck.mode === "answering" ? `Export JSON (${responseLog.size})` : "Export JSON";
    document.getElementById("prev").disabled = index === 0;
    document.getElementById("next").disabled = index === deck.slides.length - 1;
    document.getElementById("count").textContent =
      `${index + 1} / ${deck.slides.length}`;
    if (focusIndex >= 0) slide.querySelectorAll("button")[focusIndex]?.focus();
    document.getElementById("announcement").textContent =
      `Slide ${index + 1} of ${deck.slides.length}. ${s.prompt}. ` +
      (st.revealed
        ? checkedAnnouncement(s, st)
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
  function checkedAnnouncement(s, st) {
    if (["choice", "cloze", "gap"].includes(s.type)) {
      if (!st.selected)
        return `Correct answer: ${s.answer}. ${s.feedback || ""}`;
      return st.selected === s.answer
        ? `Correct. ${s.answer}. ${s.feedback || ""}`
        : `Incorrect. You chose ${st.selected}. Correct answer: ${s.answer}. ${s.feedback || ""}`;
    }
    if (s.type === "sort") {
      const wrong = s.items.filter((item, i) => st.groups[i] !== item.category).length;
      return wrong
        ? `Incorrect. ${wrong} ${wrong === 1 ? "item needs" : "items need"} correction. ${s.feedback || ""}`
        : `Correct. ${s.feedback || ""}`;
    }
    if (s.type === "order") {
      const correct =
        st.order.length === s.items.length &&
        st.order.every((itemIndex, position) => itemIndex === position);
      return `${correct ? "Correct" : "Incorrect"} order. ${s.feedback || ""}`;
    }
    return (s.answer || "") + " " + (s.feedback || "");
  }
  function reveal() {
    const s = deck.slides[index],
      st = states[index];
    if (s.type === "steps") st.step = Math.min(st.step + 1, s.items.length - 1);
    else {
      st.revealed = true;
      st.hint = false;
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
    responseLog.delete(deck.slides[index].id);
    states[index] = {
      hint: false,
      revealed: false,
      step: 0,
      selected: null,
      order: [],
      groups: {},
      mix: {},
    };
    draw();
  };
  document.getElementById("prev").onclick = () => move(-1);
  document.getElementById("next").onclick = () => move(1);
  document.getElementById("export-json").onclick = () => {
    const currentSlide = deck.slides[index];
    const payload = {
      schema: "teacher-answering-responses-v1",
      deckTitle: deck.title,
      mode: deck.mode || "teaching",
      exportedAt: new Date().toISOString(),
      responses: [...responseLog.values()].sort((a, b) => a.slideNumber - b.slideNumber),
      unansweredSlideIds: deck.slides
        .filter((slide) => (currentSlide.reviewIds || []).includes(slide.id) && !responseLog.has(slide.id))
        .map((slide) => slide.id),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2) + "\n"], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = String(deck.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    link.download = `${safeTitle || "diagnostic"}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    document.getElementById("announcement").textContent = `Exported ${payload.responses.length} recorded responses as JSON. ${payload.unansweredSlideIds.length} response items remain unanswered.`;
  };
  document.addEventListener("keydown", (e) => {
    if (e.target.isContentEditable || e.target.closest("input,textarea,select"))
      return;
    const space = e.code === "Space" || e.key === " ";
    if (space && e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (!e.repeat) document.getElementById("reset").click();
      return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      if (!e.repeat) move(e.key === "ArrowRight" ? 1 : -1);
    } else if (space) {
      // Capture Space even when a choice or navigation button has focus.
      // Enter remains the native way to activate the focused button.
      e.preventDefault();
      const control = document.getElementById("reveal");
      if (!e.repeat && !control.hidden && !control.disabled) control.click();
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
