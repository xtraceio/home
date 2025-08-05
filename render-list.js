/* 📂 tickets/2025 디렉터리의 Markdown 목록을 읽어
   ──> “2025년 1월”·“2025년 2월”… 월별 그룹으로 출력 */

const OWNER   = 'your-github-id';
const REPO    = 'your-repo';
const BRANCH  = 'main';
const FOLDER  = 'tickets/2025';

(async () => {
  const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FOLDER}?ref=${BRANCH}`;
  const res = await fetch(api);
  if (!res.ok) {
    document.getElementById('ticket-list').textContent =
      '❌ GitHub API 요청 실패…';
    return;
  }

  const files  = await res.json();
  const byMon  = new Map();              // { '01': [file, file, …], '02': … }

  files
    .filter(f => f.type === 'file' && f.name.endsWith('.md'))
    .forEach(f => {
      // 파일명 예: 2025-01-05.md  또는 2025_01_05.md  등
      const m = f.name.match(/^2025[-_]?(\d{2})[-_]?/);
      if (!m) return;                    // 날짜 파싱 실패 시 건너뜀
      const mon = m[1];                  // '01'~'12'

      if (!byMon.has(mon)) byMon.set(mon, []);
      byMon.get(mon).push(f);
    });

  // 월 오름차순 정렬
  const months = [...byMon.keys()].sort();

  const panel = document.getElementById('ticket-list');
  panel.innerHTML = '';                  // 초기화

  months.forEach(mon => {
    // ⬇️ ① 월별 제목
    const h3 = document.createElement('h3');
    h3.className = 'ticket-month';
    h3.textContent = `📅 2025년 ${Number(mon)}월`;
    panel.appendChild(h3);

    // ⬇️ ② 해당 월 파일 목록
    const ul = document.createElement('ul');
    byMon.get(mon)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(f => {
        const li   = document.createElement('li');
        const link = document.createElement('a');
        link.href  = f.html_url;
        link.target = '_blank';
        // '2025-01-05 (#4567)' 같은 링크 텍스트로 변환
        const nice = f.name.replace('.md', '')      // 확장자 제거
                           .replace(/[-_]/g, ' ')   // 구분자→공백
                           .trim();
        link.textContent = nice;
        li.appendChild(link);
        ul.appendChild(li);
      });
    panel.appendChild(ul);
  });
})();
