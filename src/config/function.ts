export function makeResponse(response: any, data: any | any[] | undefined) {
  response.result = data;
  return response;
}

// Date to string 함수
export function defaultCurrentDateTime() {
  const object = generateDateFormatComponent();

  return (
    object.year +
    '-' +
    object.month +
    '-' +
    object.day +
    ' ' +
    object.hour +
    ':' +
    object.min +
    ':' +
    object.sec
  );
}

export function generateDateFormatComponent() {
  const date = new Date();

  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1).toString()
      : (date.getMonth() + 1).toString();

  const day =
    date.getDate() < 10
      ? '0' + date.getDate().toString()
      : date.getDate().toString();

  const hour =
    date.getHours() < 10
      ? '0' + date.getHours().toString()
      : date.getHours().toString();

  const min =
    date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes().toString();

  const sec =
    date.getSeconds() < 10
      ? '0' + date.getSeconds().toString()
      : date.getSeconds().toString();

  const milSec =
    date.getMilliseconds() < 10
      ? '00' + date.getMilliseconds().toString()
      : date.getMilliseconds() < 100
      ? '0' + date.getMilliseconds().toString()
      : date.getMilliseconds().toString();

  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    min: min,
    sec: sec,
    milSec: milSec,
  };
}
