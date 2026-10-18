# Backlog — omeles.com

Bilinen eksikler ve teknik borç. **Bu dosya ceyhuncenger.tr portalına akar:**
saatlik tarama her açık maddeyi bir göreve dönüştürür (`kaynak: backlog`,
alan: Proje), `[x]` yapılan ya da silinen maddeyi portalda da kapatır.

Amaç, bir eksiğin yalnızca sohbette söylenip kaybolmaması. Bir şey "sonra
yapılacak" diye bırakıldıysa yeri burasıdır — konuşma, yol haritası ya da
CLAUDE.md değil.

## Biçim

```
### <grup>
- [ ] !! Çok acil madde
- [ ] ! Öncelikli madde
- [ ] Normal madde
      Girintili satırlar açıklamadır, göreve not olarak geçer.
- [x] Kapanmış madde
```

Başlık, görevin kimliğidir (`backlog:<slug>`). Başlığı değiştirmek portalda
**yeni** bir görev açar, eskisini kapatır; bu yüzden ifadeyi korumaya çalış,
ayrıntıyı açıklama satırına yaz.

---

## Açık

### güvenlik

- [ ] ! Bağımlılıklarda 74 güvenlik açığı (4 kritik, 33 yüksek)
      18 Eki 2026'da GitHub push sırasında raporladı (Dependabot,
      github.com/Coenta/omeles.com/security/dependabot): 4 kritik, 33 yüksek,
      32 orta, 5 düşük. Site Vercel'de yayında (omelescom.vercel.app). Önce
      kritik/yüksekleri incele: `npm audit`, doğrudan bağımlılıkları güncelle,
      build + sayfa kontrolüyle doğrula; yalnız dolaylı/geliştirme
      bağımlılığında kalanları ayrıca not et.

---

## Kapandı
