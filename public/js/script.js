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
  const flashMessages = document.querySelector('.flash-messages');
  
  setTimeout(() => {
    if (document.URL.includes('register')) {
      window.scroll(0, parseInt(sessionStorage.registerScrollY));
    } else if (document.URL.includes('login')) {
      window.scroll(0, parseInt(sessionStorage.loginScrollY));
    }
    [sessionStorage.registerScrollY,
    sessionStorage.loginScrollY] = [0,0];
  }, 30);
  if (flashMessages) {
    flashMessages.style.opacity = '0%';
    flashMessages.style.opacity = '100%';
    setTimeout(() => {
      console.log(flashMessages);
      flashMessages.style.opacity = '0%';
    }, 10000);

  }
  
  window.addEventListener('beforeunload', () => {
    if (document.URL.includes('register')) {
      sessionStorage.registerScrollY = window.scrollY;
    } else if (document.URL.includes('login')) {
      sessionStorage.loginScrollY = window.scrollY;
    }
  });
  
  window.onload = () => {
    navElements.forEach((el) => {
      el.removeAttribute('id');
      el.parentElement.removeAttribute('id');
    });
  };

})();