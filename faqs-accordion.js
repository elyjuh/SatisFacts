document.querySelectorAll('.faqs-accordion details').forEach((detail) => {
    const summary = detail.querySelector('summary');
    const content = detail.querySelector('.details-content');

    summary.addEventListener('click', (e) => {
        e.preventDefault(); 

        if (!detail.hasAttribute('open')) {
            detail.setAttribute('open', '');
            content.style.height = content.scrollHeight + 'px';
            content.style.opacity = '1';

            content.addEventListener('transitionend', function setAutoHeight() {
                content.style.height = 'auto';
                content.removeEventListener('transitionend', setAutoHeight);
            });
        } else {
            content.style.height = content.scrollHeight + 'px';
            content.style.opacity = '0';
            requestAnimationFrame(() => {
                content.style.height = '0';
            });

            content.addEventListener('transitionend', function removeOpen() {
                detail.removeAttribute('open');
                content.removeEventListener('transitionend', removeOpen);
            });
        }
    });
});