const dateFormatter = (date:Date) => {
    console.log(date);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + "년 " + month + "월 " + day + "일";
  };
  
  export {dateFormatter};