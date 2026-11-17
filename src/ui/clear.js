// ---------------- clear saved files ----------------
async function savedSize() {
  try { const e = navigator.storage && await navigator.storage.estimate(); return e && e.usage ? e.usage : null; } catch (e) { return null; }
}
let clearArmed = null;
const CLEAR_NAME = 'Delete saved files and forget folder';
$('bClear').onclick = async () => {
  const b = $('bClear');
  if (!clearArmed) {
    const sz = await savedSize();
    // the name says what it does (UI review, item 12, 17 Nov 2026; Clear saved files up to then); the second click states the size
    b.textContent = `Click again to delete ${sz == null ? 'the saved files' : sz < 1048576 ? 'less than 1 MB' : Math.round(sz / 1048576) + ' MB'} and forget the folder`;
    clearArmed = setTimeout(() => { clearArmed = null; b.textContent = CLEAR_NAME; }, 4000);
    return;
  }
  clearTimeout(clearArmed); clearArmed = null;
  try { const db = await idb.open(); await new Promise((res) => { const q = db.transaction('overviews', 'readwrite').objectStore('overviews').clear(); q.onsuccess = res; q.onerror = res; }); } catch (e) { }
  b.textContent = CLEAR_NAME;
  // back to a first visit straight away, without a reload
  hlForget(); closeDemo();
  setMsg('Done: the saved files are deleted and the folder forgotten. Choose your Half-Life folder to go on.');
};
