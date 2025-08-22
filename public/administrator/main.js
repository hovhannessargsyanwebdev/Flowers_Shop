const { Placeholder } = require("react-bootstrap");

document.addEventListener('DOMContentLoaded', function() {
  // Обработка кликов по ссылкам в левой панели
  const menuLinks = document.querySelectorAll('.adm-left-side a[href]');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');
      
      // Загружаем контент в iframe
      document.getElementById('contentFrame').src = url;
      updateNavChain(this.textContent.trim(), url);
    });
  });
  
  function updateNavChain(title, url) {
    const navChain = document.getElementById('main_navchain');
    navChain.innerHTML = `
      <a class="adm-navchain-item" href="#"><span class="adm-navchain-item-text adm-navchain-item-desktop">Рабочий стол</span></a>
      <span class="adm-navchain-item"><span class="adm-navchain-delimiter"></span></span>
      <a href="javascript:void(0)" class="adm-navchain-item"><span class="adm-navchain-item-text">${title}</span></a>
    `;
  }
});