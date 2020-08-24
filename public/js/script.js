/*
(() => {


  

  // card, feedcontainer 
  const cardElements = [...document.querySelectorAll('.feed-element')];
  const feedContainer = document.querySelector('.feed');

  // checken wo card auf der seite ist
  // active klasse geben
  const openCard = (e) => {
    const card = e.target;

    if (card === feedContainer) return;
    if (card.className === 'feed-element') {
      card.addEventListener('mouseout', closeCard(card), {once: true});
      // card.addEventListener('mouseup', closeCard(card), {once: true});
      card.classList.add('feed-element--active');
    }
  };

  const closeCard = (card, e) => {
    console.log(e);
    console.log(card);
    card.classList.remove('feed-element--active');
  };
  

  cardElements.forEach((el) => {
    let [feedWidth, feedHeight] = [feedContainer.clientWidth, feedContainer.clientHeight];
    // console.log(feedWidth);
    const [left, top] = [
      (el.offsetLeft / feedWidth *100),
      (el.offsetTop / feedHeight *100)];
    console.log(top,left);
    el.style.top = `${top}%`;
    el.style.left = `${left}%`;
  });

  feedContainer.addEventListener('click', openCard);




})();

*/


(() => {
  const navElements = [...document.querySelectorAll('.nav__element')];
  const activePageURL = Math.round(Math.random() * 4);
  // console.log(activePageURL);
  
  // navElements[activePageURL].classList.add('nav__element--open');
  // navElements[activePageURL].parentElement.style.boxShadow = 'none';
  // navElements[activePageURL].parentElement.style.background = 'linear-gradient(var(--color-accentblue), var(--color-bgblue))';
  setTimeout(() => {
    
    // const nav = document.querySelector('.nav__list');
    // const navLinkHeight = document.querySelector('.nav__link')
    //   .getBoundingClientRect().height;
    // nav.style.height = `${(navLinkHeight) + 10}px`;
    // console.log(navLinkHeight);
  }, 70);
  
  
  // window.onload = () => {
  //   navElements.forEach((el) => {
  //     el.removeAttribute('id');
  //     el.parentElement.removeAttribute('id');
  //   });
  // };

})();