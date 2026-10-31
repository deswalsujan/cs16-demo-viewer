# Test demo manifest

Every test demo on Sujan's Mac (`tests/DEMOS.md` has each one's event and status) with its size and SHA-256, so a copy of `~/code/cs16-data/test-demos` can be checked: Sujan keeps one on Google Drive (Sujan, 1 Nov 2026). The SHA-256 of the 48 demos in `tests/expected/` ("yes", or "joined part" for a part named only in another demo's file) is the one there; the other 16 were computed on the Mac on 1 Nov 2026, before the move. 64 demos, 2,215,772,863 bytes (2.2 GB). The two Windows-only bot test demos of 5 Oct 2026 (`bangtest.dem`, `full_match_demo-2610050843-de_train.dem`) aren't on the Mac, so they aren't listed.

Check a folder (any copy, subfolders included; demos are found by SHA-256, under any name):

```
python3 tests/demo_dirs.py check ~/code/cs16-data/test-demos
```

It prints each demo that's missing, one found under another name, and any other `.dem` file in the folder, and ends in PASS or FAIL (exit code 1 when one is missing). A copy on Google Drive is downloaded file by file to be hashed.

When a test demo is added or deleted, change its row here along with its row in `tests/DEMOS.md`. `tests/notes_check.py` fails when a demo of `tests/expected/` has no row here with the same SHA-256 and name.

| Demo file | Bytes | SHA-256 | In `tests/expected/` |
|---|---|---|---|
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | 76,839,319 | `9ae9201a2c7fc2c7c385b9bda83469d60cc8b159e69dc2725dc126cc76eab9df` | yes |
| `1110240934--auto_de_train.dem_Again-vs-Navi.dem` | 73,217,242 | `73a7d0251644908b8d8801f8730125ea87ed142604bc7fcf95a90dc4ecd014b8` | no |
| `1110241407--auto_de_inferno.dem_mousesports-vs-AGAIN.dem` | 47,173,726 | `e0da33705ab4c165e8e84c6ded8ec52f56b4f0590892b88a9edd847a2e0b035c` | yes |
| `2010-07-01_15h58_-1007021005-de_inferno Burning vs FairFrag.dem` | 32,061,267 | `52ce4534d1f6e60ffd844816cf13df95ce5d31f71e123e514aae6a0cea0af5dd` | yes |
| `2011-10-24_16h08_NaVi_SK-1110241609-de_inferno.dem` | 50,533,200 | `77ab7d2ba4b5ecec576e383cffd99fe0c807fa9b011e59209d430c6fd92cb2ad` | yes |
| `2011-10-24_16h08_NaVi_SK-1110241724-de_inferno.dem` | 8,810,337 | `e2164cfd2851b0376f1c044bc49711d2383f7129b1ade997be185ec491b2bae5` | no |
| `2011-10-24_16h08_NaVi_SK-1110241740-de_inferno.dem` | 10,585,019 | `452739d62db2a74426d43094fac0984d81a1e7eb27cd27f0733570e097fe6af2` | no |
| `485.53.706623-0803162045-de_train.dem` | 13,568,495 | `2fbb765b8c61755ab9eb47a22fa5c2ae62d2af33a5b6f3314a4ce8edd7939f18` | yes |
| `53.52.1646548-1005272144-de_dust2.dem` | 17,261,648 | `ffc4d90f9a5fc46e12ef6ed2837a9284723ca78a05b6e1f08fdb160fd67f1104` | yes |
| `auto-server1-1106262105-de_tuscan.dem` | 37,679,527 | `2def4956ff8d8d932611cb6bb2fb0d2962b70195604af480b4549a109e1c28d7` | yes |
| `auto_ifng-1103030950-de_dust2.dem` | 46,398,471 | `35e1284f61ab95be44721c56dec61ce487f3873dc9009822b9fcb3d198d1039d` | yes |
| `auto_ifng-1110042145-de_forge.dem` | 18,186,092 | `b9b0ad89ea107d59e7f3024919cde447f43724f7e5dc99a4a9df41e78d5b4b95` | yes |
| `auto_ifng-1110042211-de_forge.dem` | 16,257,640 | `5fd81c289429f4a893775d4f21ad5745c827f96f86cf985dba3cf41fe5febf3d` | joined part |
| `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | 63,369,159 | `12b0f42d2d9350a980f231b971ea403343d217e95b6dd5558fe89d4f946851b1` | yes |
| `fnatic-vs-m5-dhs11-1106191035-de_nuke.dem` | 15,330,876 | `ac22a440665cac47258f4d9dea9fd345c8b3c0c5714a805f9ea665a2b15dbd46` | yes |
| `fnatic-vs-navi-gamegune2012-1207282133-de_dust2.dem` | 20,430,858 | `cb975f767b66e54ede45cff76fc6c6cdd901345524a48a3a8af382878ec15552` | yes |
| `fnatic_vs_EG_EM3Global-0903061800-de_dust2.dem` | 28,265,675 | `66e5ac8f8a472bd779ebb29cce3f5d26ae7332e834eaf647691c525f5c221598` | yes |
| `fx-vs-esahara-dhw2010-1011270905-de_dust2.dem` | 36,343,117 | `f86089b8d22b7e99024a251f0ff152f05cfe34ae87eb90836531898eaea7e4c7` | yes |
| `fx-vs-esahara-dhw2010-1011271131-de_nuke.dem` | 26,912,984 | `892b999fbf9a6bb7f9879cbec6086573eede40a58ad822521d6d9e9613ecd702` | yes |
| `fx-vs-lions-dhw2010-bronze-1011272002-de_inferno.dem` | 20,836,417 | `3919a6c19d4ff0a6e6962511b3476c2fe3f625f37e679868aba19452abb46f03` | yes |
| `fx-vs-lions-dhw2010-bronze-1011272059-de_nuke.dem` | 17,238,806 | `58a241ae0875b4bf773638735a66353ac6e6602d3aa2b95053e53ce45097c9c8` | yes |
| `fx-vs-mtw-xperia2011-1104240025-de_inferno.dem` | 49,731,263 | `28dc6796c3e19e211714e8b72b6ce5c46f9e83ebb490d5fc8400e99bae9801a6` | yes |
| `fx-vs-mtw-xperia2011-1104240112-de_inferno.dem` | 50,027,056 | `260f1fc7592a95da5be13e720573928c2e3bf63d47cadec350f48ca831181c53` | yes |
| `fx-vs-mtw-xperia2011-1104240212-de_nuke.dem` | 32,467,997 | `efee36e1bd4762abb70c01350a8adc025f2b7a41f14701a47f9847d3d21ca63b` | yes |
| `fx-vs-mtw-xperia2011-1104240242-de_nuke.dem` | 79,219,864 | `08363d9e17484c9289848a1f79c6dc8b070e81cb7ef23feba26aafc1a736b3af` | yes |
| `FX-vs-sk-iem5-inf.dem` | 33,855,804 | `7647cceb130aead0ae7007661b35f5abe39ef744c51c71fe95795985f7309a36` | yes |
| `k1ck-vs-eq-dhwinter2011-1111260056-de_nuke.dem` | 15,222,316 | `893580d1af6c7fd4e89b61792684185b7464c12fe5526742b5019c5b0de4d439` | yes |
| `match-1_de_barcelona-Cts_27-03-2025_15.10.23.dem` | 78,486,607 | `9d27e92ca71e930152661b390bbb14ff9baf001d6aa61686fd0d78e4304106f4` | no |
| `match-1_de_barcelona-Ts_27-03-2025_15.32.54.dem` | 39,742,118 | `a22f6e3826bc1a02e10cf8118c5687f7d2805378c902ab814e4aac591a88be40` | no |
| `match-2_de_mirage_32[Cts]_27-03-2025_14.47.11.dem` | 63,260,992 | `1e526d3e89ee793b04f9e14cba0387705db8e067ae0c4dfd1eb80d9ec0f0ebc3` | no |
| `match-2_de_mirage_32[Ts]_27-03-2025_14.23.27.dem` | 77,852,217 | `811836bb0f956b3496b09513d1c94602c507fe5f123ab0a60c363e4be089fab6` | no |
| `match-3_css_cache_00-23-35_28-07-2022.dem` | 187,783,131 | `24976ec9844b57a8b39ecba989bf36ccb02c967b1e0b8805a67bddc7d6289d84` | no |
| `match-4-[PuB]_M-[de_nuke32]_D-[08_24_2021]_T-[00_44].dem` | 202,696,671 | `04d3924052e91e6b4268dd2a5dcc3eb1bc5c978d4dacd3ccf947ff4fbee31904` | no |
| `match-5-[PuB]_M-[de_nuke32]_D-[08_25_2021]_T-[22_09].dem` | 165,298,050 | `6b801c12ad3249ebd101f1909aa15b418d00313fcf843ea96a7ff241b5f78337` | no |
| `mouz.SK.EM2.real-0803091025-de_nuke.dem` | 24,794,815 | `de052e0c8f2c91395290d17724244ad93aa7ea60456ff5d491a26215a645c2d9` | yes |
| `mtw-vs-lions-dhs11-1106191044-de_nuke.dem` | 18,489,066 | `b726f7fdde0e5cd69f0f7a5e884163e6b70bacf3151d0d9ac01e787e75e22cae` | yes |
| `mtw-vs-navi-eswc2010semi-real-1007031530-de_tuscan.dem` | 19,336,932 | `b0c1be388d6ba0813592d61ee15e8dfa134abf5ba7a64247b06bbc42a5bd47a7` | yes |
| `mtw-vs-navi-eswc2010semi-real-1007031625-de_tuscan.dem` | 6,517,436 | `c4d9814c5c5414071fc500e11c5ee77abc26e840151cd4dd8f9a92e9dc779b31` | joined part |
| `mtw-vs-navi-eswc2010semi-real-1007031645-de_tuscan.dem` | 3,276,618 | `8e6d47608132f2c3aaf5fbad81c4652a2e0935ae39376c8f9e204ad7579fc888` | yes |
| `mtw-vs-navi-eswc2010semi-real-1007031655-de_tuscan.dem` | 5,080,653 | `11f59c63492e75895821f734cf2e726f553d1085c5052d2968bdc4e2711caf07` | yes |
| `mtw-vs-navi-eswc2010semi-real-1007031710-de_train.dem` | 14,536,189 | `90230ba694c437393f9d7807ce3626e1a25c0ecfd990ff88935b27cda3591dbf` | yes |
| `mtw.mym.consfinal.EM3-0903081339-de_dust2.dem` | 28,377,690 | `69b9c531f48abe8f761fcfef0365545dff320e9ba4aae88c0697c0582c56a768` | yes |
| `mtw.tyloo.estars-0907250910-de_nuke.dem` | 20,102,861 | `3cbe4c510742b9343884904631665ad9b723f502fa7f6b05a7c726d28c24d1cf` | yes |
| `mym.fnatic.final-0612201357-de_train.dem` | 23,703,735 | `f653119a1ff5e885ea35e64855116548dab8ed3926e99a373aed10ebcce643ce` | yes |
| `navi-vs-fx-sec2011-final-1110091449-de_train.dem` | 15,665,841 | `bb2414272b53ca16bd594643b6d4438fb847c0134d28ac5335cebef79bab09e3` | yes |
| `navi-vs-fx-sec2011-final-1110091531-de_dust2.dem` | 21,035,975 | `e5214ee5ce39af8bf3285aa299bb9bb7d4e39445c9828ece20dc7ae3e928cea2` | yes |
| `navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem` | 23,811,901 | `c73716f64bc259082427ee0301d9b2fd0826eb55c896a2e0fd311208e22d2959` | yes |
| `noa.penta-0610211800-de_train.dem` | 15,258,833 | `aefb97aa3b55f887ec5d9765868d5875057b308d20abe71f53c3abc2d2a08f4a` | yes |
| `roccat.estro.EMII.cebit-0803081202-de_inferno.dem` | 14,645,288 | `c81ba62865c826a4c0fbeb21a65b590c52b9b181acf782facaab4a9a17e066da` | no |
| `roccat.fnatic.EMII-0803071948-de_inferno.dem` | 24,203,004 | `040d89a0ffbbf70cc32a067a04b6e480ecbb58224344af7518460647d6bbb84d` | yes |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | 19,548,376 | `94cdb3747ed31678dded5538679f1ac1d371f0e94799e68825b91b2185dc9114` | yes |
| `sk-vs-navi-dhwinter2011-1111261019-de_train.dem` | 40,049,341 | `ddd178a207efa59d506bf5b4d298eca7b75768d4e6b42f78fa60cd10030d9243` | yes |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | 20,808,020 | `b0a46f21d26c2f6b6214818f541cd0fab243b14d26696c3ac0fa7ca0f33f4940` | yes |
| `SK_vs_e-STRO_WCG2008-0811081854-de_dust2.dem` | 1,598,584 | `d11acab6cb6d77df9607e6117865c15b0905d08c1909d66049787a26072b244f` | yes |
| `SK_vs_e-STRO_WCG2008-0811081859-de_train.dem` | 129,882 | `2ca2346c98e0136a74301bc5cb9fba7d8b44a219bb4dab5a8a561aa9ad235cc9` | no |
| `SK_vs_e-STRO_WCG2008-0811081900-de_train.dem` | 16,387,629 | `04f231e20bb2d1692322d4ab9b6ae6d53ef6bb32387f3b739533c56993ceb343` | yes |
| `SK_vs_e-STRO_WCG2008-0811081945-de_nuke.dem` | 1,452,824 | `5fa3fe0f627f846d2ff695d22028b03fa81d9c8e4d52db4068b77983e9d91a27` | no |
| `SK_vs_e-STRO_WCG2008-0811081949-de_dust2.dem` | 62,834 | `867d090748d05f74662699cdd100ec2265618dc81e0b139b53f6da6967ce818b` | no |
| `SK_vs_e-STRO_WCG2008-0811081950-de_dust2.dem` | 19,774,086 | `ef6670676bea2037fce1b896277f517a917289258da9fd8164ab6884d14f1738` | yes |
| `SK_vs_e-STRO_WCG2008-0811082043-de_nuke.dem` | 19,939,312 | `cb0ce3c532eb2589f0ae50637a5e1b1fd3572f9aebd777a1b74bb22fe56048ec` | yes |
| `virtus.attax.EMII-0803071948-de_inferno.dem` | 8,169,762 | `0c37b19421bf4e9c6684339a96e5768645b227134f3b0f0f02ebbde5c23f4a3e` | yes |
| `virtus.attax.EMII-0803072013-de_train.dem` | 2,632,643 | `436de8ee5bef7e83a89def3df83c0bf958d61dfd754b3fb68df764737e233729` | no |
| `virtus.attax.EMII-0803072031-de_train.dem` | 214,837 | `1c75b029ca87bcf8de2d690911109992039ea85033f47040ea5590d323aef36d` | no |
| `virtus.attax.EMII-0803072033-de_inferno.dem` | 33,223,935 | `b8d592a536f4ac8a4e2de35a104942bbacc64913f722cf9e7dec38ee82744aaa` | yes |
