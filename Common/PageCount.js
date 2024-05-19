const pageCount = (totalUser, limit) => {
    const pages = [];
    for (let i = 1; i <= Math.ceil(totalUser / limit); i++) {
      pages.push(i);
    }
    return pages;
  };

module.exports = pageCount;