// ---------------- clear saved files ----------------
async function savedSize() {
  try { const e = navigator.storage && await navigator.storage.estimate(); return e && e.usage ? e.usage : null; } catch (e) { return null; }
}
let clearArmed = null;
$('bClear').onclick = async () => {
  const b = $('bClear');
  if (!clearArmed) {
    const sz = await savedSize();
    b.textContent = `Click again to forget the folder and delete ${sz == null ? 'saved files' : sz < 1048576 ? 'less than 1 MB of saved files' : Math.round(sz / 1048576) + ' MB of saved files'}`;
    clearArmed = setTimeout(() => { clearArmed = null; b.textContent = 'Clear saved files'; }, 4000);
    return;
  }
  clearTimeout(clearArmed); clearArmed = null;
  try { const db = await idb.open(); await new Promise((res) => { const q = db.transaction('overviews', 'readwrite').objectStore('overviews').clear(); q.onsuccess = res; q.onerror = res; }); } catch (e) { }
  b.textContent = 'Clear saved files';
  // back to a first visit straight away, without a reload
  hlForget(); closeDemo();
  setMsg(`Done: the folder is forgotten and the saved files are deleted.${fsaOK() ? ' Chrome still remembers that it may read the folder; to remove that too, click the icon left of the address bar and choose Remove access.' : ''}`);
};
