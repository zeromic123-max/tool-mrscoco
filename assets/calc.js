/* 종부세 분납 계산 로직 — 종합부동산세법 제20조, 같은 법 시행령 제16조, 농어촌특별세법 제9조 기준 */
(function (root) {
  var LOW = 2500000;   // 250만원
  var HIGH = 5000000;  // 500만원

  function maxInstallment(tax) {
    if (!(tax > LOW)) return 0;
    if (tax <= HIGH) return tax - LOW;
    return Math.floor(tax * 0.5);
  }

  function nextWeekday(d) {
    var x = new Date(d.getTime());
    while (x.getDay() === 0 || x.getDay() === 6) x.setDate(x.getDate() + 1);
    return x;
  }

  // year: 고지 연도. 정기 납부기한 12/15, 분납 기한은 그로부터 6개월(다음 해 6/15 무렵)
  function deadlines(year) {
    var due = nextWeekday(new Date(year, 11, 15));
    var inst = nextWeekday(new Date(year + 1, 5, 15));
    return { due: due, installment: inst };
  }

  function calc(input) {
    var tax = Math.max(0, Math.floor(Number(input.tax) || 0));
    var farmGiven = input.farm !== '' && input.farm != null && !isNaN(Number(input.farm));
    var farm = farmGiven ? Math.max(0, Math.floor(Number(input.farm))) : Math.floor(tax * 0.2);
    var max = maxInstallment(tax);
    var want = input.want === '' || input.want == null ? max : Math.max(0, Math.floor(Number(input.want) || 0));
    var split = Math.min(want, max);
    var farmSplit = tax > 0 ? Math.floor(farm * split / tax) : 0;
    return {
      tax: tax,
      farm: farm,
      farmEstimated: !farmGiven,
      eligible: max > 0,
      max: max,
      split: split,
      capped: want > max,
      farmSplit: farmSplit,
      payNow: (tax - split) + (farm - farmSplit),
      payLater: split + farmSplit,
      total: tax + farm
    };
  }

  var api = { calc: calc, maxInstallment: maxInstallment, deadlines: deadlines };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.JbsCalc = api;
})(this);
