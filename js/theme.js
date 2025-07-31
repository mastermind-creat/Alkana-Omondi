 // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        const iconMoon = document.getElementById('icon-moon');
        const iconSun = document.getElementById('icon-sun');

        function updateThemeIcons() {
            if (html.classList.contains('dark')) {
                iconMoon.classList.add('hidden');
                iconSun.classList.remove('hidden');
            } else {
                iconMoon.classList.remove('hidden');
                iconSun.classList.add('hidden');
            }
        }

        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        updateThemeIcons();

        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
            updateThemeIcons();
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('pointer-events-none');
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.add('opacity-0');
                mobileMenu.classList.add('pointer-events-none');
            });
        });
        