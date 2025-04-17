document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.querySelector(".nav-links").classList.toggle("active");
    });
});

// typewriter effect
document.addEventListener("DOMContentLoaded", () => {
    const text = document.getElementById("hidden-text").textContent.trim();
    const target = document.querySelector("#about-text p");
    const button = document.getElementById('contact-btn');
    
    if (!target) return;

    target.textContent = "";  

    let index = 0;

    function typeLetter() {
        if (index < text.length) {
            const letter = document.createElement('span'); 
            letter.textContent = text[index];
            letter.classList.add('fade-in'); 

            target.appendChild(letter); 

            index++;
            setTimeout(typeLetter, 15); 
        } else {
            setTimeout(triggerButton, 500); 
        }
    }

    // Jiggle button to hint at what to do next
    function triggerButton() {
        button.style.animation = 'jiggle 0.4s ease';
        
        button.addEventListener('animationend', () => {
            button.style.animation = ''; 
        });
    }

    typeLetter();
});


