/* ▣ 연도 설정 (index.html에서 data-year 속성 전달) ▣ */
const scriptEl = document.currentScript;
const YEAR = scriptEl.getAttribute('data-year') || '2025';
const DATA_URL = `${YEAR}.data`;
const BASE_URL = `./tickets/abcdEFGH`;

/* ▣ 렌더링 ▣ */
fetch(DATA_URL)
  .then(r => r.text())
  .then(text => {
    const container = document.getElementById('ticket-list');
    container.innerHTML = '';

    text.trim().split(/\r?\n/).forEach(line => {
      const [monthStr, entries] = line.split('|');
      if (!entries) return;

      const month = monthStr.padStart(2, '0');
      const h3 = document.createElement('h3');
      h3.textContent = `📅 ${YEAR}년 ${parseInt(month)}월`;
      container.appendChild(h3);

      const ul = document.createElement('ul');

      entries.split(',').forEach(item => {
        const [dayStr, ...ids] = item.split(':');
        const day = dayStr.padStart(2, '0');

        ids.forEach(id => {
          if (!id) return;
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = `${BASE_URL}/${YEAR}/${month}/${day}/${id}.html`;
          link.target = '_blank';
          link.textContent = `${YEAR}년 ${parseInt(month)}월 ${parseInt(day)}일 (#${id})`;
          li.appendChild(link);
          ul.appendChild(li);
        });
      });

      container.appendChild(ul);
    });
  })
  .catch(err => console.error('데이터 로드 오류:', err));
