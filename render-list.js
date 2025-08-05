/* ▣ 사용자 설정 ▣ */
const DATA_URL = '2025.data';                // .data 파일
const BASE_URL = './tickets/abcdEFGH';       // HTML 경로 prefix

/* ▣ 렌더링 ▣ */
fetch(DATA_URL)
  .then(r => r.text())
  .then(text => {
    const container = document.getElementById('ticket-list');
    container.innerHTML = '';                // 초기화

    text.trim().split(/\r?\n/).forEach(line => {
      const [monthStr, entries] = line.split('|');   // "1|5:4567,14:4569"
      if (!entries) return;

      const month = monthStr.padStart(2, '0');

      /* ① 월별 제목 */
      const h3 = document.createElement('h3');
      h3.className  = 'ticket-month';
      h3.textContent = `📅 2025년 ${parseInt(month)}월`;
      container.appendChild(h3);

      /* ② 월별 목록 */
      const ul = document.createElement('ul');
      ul.className = 'ticket-list-month';

      entries.split(',').forEach(item => {
        const [dayStr, ...ids] = item.split(':');    // "5:4567:4568"도 OK
        const day = dayStr.padStart(2, '0');

        ids.forEach(id => {
          if (!id) return;                           // 빈값 보호
          const li   = document.createElement('li');
          const link = document.createElement('a');
          link.href  = `${BASE_URL}/2025/${month}/${day}/${id}.html`;
          link.target = '_blank';
          link.textContent = `2025년 ${parseInt(month)}월 ${parseInt(day)}일 (#${id})`;
          li.appendChild(link);
          ul.appendChild(li);
        });
      });

      container.appendChild(ul);
    });
  })
  .catch(err => console.error('데이터 로드 오류:', err));
