# omeles.com

## Eksikler ve yapılacaklar → `docs/BACKLOG.md`

Bu projede fark edilen her eksik, teknik borç ya da "sonra yapılacak" iş
**`docs/BACKLOG.md`** dosyasına yazılır. Yalnızca sohbette söylenen ya da yol
haritası, plan veya bu dosya gibi başka bir belgeye yazılan madde kaybolur:
ceyhuncenger.tr portalı yalnızca `docs/BACKLOG.md`'yi okur ve oradaki her açık
maddeyi bir görev yapar.

- Biçim: `### grup` başlıkları altında `- [ ] Başlık`; `!` öncelikli, `!!` acil.
  Girintili satırlar açıklamadır. Örnek, dosyanın kendi başında.
- Başlık görevin kimliğidir: değiştirmek portalda yeni bir görev açar.
  Ayrıntıyı açıklama satırına yaz.
- Çözülen madde `[x]` yapılır.
- Portal saatte bir tarar ve taramadan önce bu bilgisayardaki kopyayı
  `git pull --ff-only` ile günceller. Bulutta çalışıyorsan değişikliği
  commit'leyip push et; push edilmeyen madde portala ulaşmaz. Bu bilgisayarda
  çalışıyorsan `Projeler/ceyhuncenger.tr` içinde `npm run scan:repos` ile
  hemen yansıtabilirsin.
