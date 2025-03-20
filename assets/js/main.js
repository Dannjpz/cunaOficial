/* Movimiento de los inner */

const handleHover = (e) => {
	const element = e.currentTarget; // Mejor referencia que e.target
	const rect = element.getBoundingClientRect();
	const x = (e.clientX - rect.left) / rect.width - 0.5;
	const y = (e.clientY - rect.top) / rect.height - 0.5;

	element.style.transform = `
        perspective(1000px)
        rotateX(${y * 50}deg)
        rotateY(${x * 50}deg)
    `;
};
// if (!browser.mobile) {
	document.querySelectorAll('.inner').forEach(inner => {
		inner.addEventListener('mousemove', handleHover);
		inner.addEventListener('mouseleave', () => {
			inner.style.transform = 'none';
		});
	});
// }

