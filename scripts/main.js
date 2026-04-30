import { loadPartials } from './partials.js';
import { initTabs }     from './tabs.js';
import { initTimer }    from './timer.js';
import { initCalendar } from './calendar.js';
import { initModal }    from './modal.js';
import { initChat }     from './chat.js';

(async function bootstrap() {
  await loadPartials([
    ['[data-partial="tabbar"]',           'partials/tabbar.html'],
    ['[data-partial="sidebar"]',          'partials/sidebar.html'],
    ['[data-partial="topbar"]',           'partials/topbar.html'],
    ['[data-partial="timer-popover"]',    'partials/timer-popover.html'],
    ['[data-partial="calendar-popover"]', 'partials/calendar-popover.html'],
    ['[data-partial="modal"]',            'partials/modal.html'],
  ]);

  initTabs();
  initTimer();
  initCalendar();
  initModal();
  initChat();
})();
