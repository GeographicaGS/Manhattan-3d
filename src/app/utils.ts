export function formatNumber(number, units = '', places = 2, compactNumber = false, thousand = ',', decimal = '.') {
    const negative = number < 0 ? '-' : '';
    if (compactNumber) {
      number = parseFloat(number);

      let tail = '';
      if (number > 1000000) {
        number = number / 1000000;
        tail = 'M';
      } else if (number > 1000) {
        number = number / 1000;
        tail = 'K';
      }
      const compacted = {
        number: parseFloat(number.toFixed(places)),
        tail: tail
      };
      number = compacted.number;
      units = compacted.tail + ' ' + units;
    } else {
      units = ' ' + units;
    }
    units = units === ' ' ? '' : units;

    const i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '';
    let j = i.length;
    j = j > 3 ? j % 3 : 0;
    const part_1 = negative + (j ? i.substr(0, j) + thousand : '');
    const part_2 = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand);
    let part_3 = (places ? decimal + Math.abs(number - <any>i).toFixed(places).slice(2) : '');
    if (part_3 === '.00' || part_3 === '.0') {
      part_3 = '';
    }

    return part_1 + part_2 + part_3 + units;
  }
