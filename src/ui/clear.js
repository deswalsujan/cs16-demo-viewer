// ---------------- clear saved files ----------------
async function savedSize() {
  try { const e = navigator.storage && await navigator.storage.estimate(); return e && e.usage ? e.usage : null; } catch (e) { return null; }
}
let clearArmed = null;
const CLEAR_NAME = 'Delete saved files';
$('bClear').onclick = async () => {
  const b = $('bClear');
  if (!clearArmed) {
    const sz = await savedSize();
    // the name says what it does (UI review, item 12, 17 Nov 2026; Clear saved files up to then; not "forget folder", since the
    // viewer asks for the folder on every visit anyway, Sujan, 17 Nov 2026); the second click states the size
    b.textContent = `Click again to delete ${sz == null ? 'the saved files' : sz < 1048576 ? 'less than 1 MB of saved files' : Math.round(sz / 1048576) + ' MB of saved files'}`;
    clearArmed = setTimeout(() => { clearArmed = null; b.textContent = CLEAR_NAME; }, 4000);
    return;
  }
  clearTimeout(clearArmed); clearArmed = null;
  try { const db = await idb.open(); await new Promise((res) => { const q = db.transaction('overviews', 'readwrite').objectStore('overviews').clear(); q.onsuccess = res; q.onerror = res; }); } catch (e) { }
  b.textContent = CLEAR_NAME;
  // back to a first visit straight away, without a reload
  hlForget(); closeDemo();
  setMsg('Done: the saved files are deleted. Choose your Half-Life folder to go on.');
};
