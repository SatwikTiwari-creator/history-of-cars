/**
 * The History of Cars - Core Application Logic
 * Integrates Scrollytelling, Cruise Control, Procedural Audio,
 * Search, Dream Garage, and IntersectionObserver fallbacks.
 */

import { ERAS, CARS, AUDIO_PROFILES } from './cars-data.js';
import { renderCarSvg } from './car-art.js';
import { audioEngine } from './audio-engine.js';

class CarHistoryApp {
  constructor() {
    this.currentEraIndex = 0;
    this.currentFilter = 'all';
    this.cruiseSpeed = 0; // 0 = stopped, 1 = 1x, 2 = 2x
    this.cruiseAnimId = null;
    this.garageIds = new Set(JSON.parse(localStorage.getItem('car_history_garage') || '[]'));
    this.activeInspectedCar = null;

    // DOM Elements
    this.highwayContainer = document.getElementById('highway-content');
    this.odometerYearEl = document.getElementById('odometer-year');
    this.speedometerValEl = document.getElementById('speedometer-val');
    this.eraBadgeTextEl = document.getElementById('era-badge-text');
    this.eraBadgeEl = document.getElementById('era-badge');
    this.progressBarEl = document.getElementById('timeline-progress');
    this.minimapLabelsEl = document.getElementById('minimap-labels');
    this.minimapThumbEl = document.getElementById('minimap-thumb');

    // Controls
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.cruiseControlBtn = document.getElementById('cruise-control-btn');
    this.searchBtn = document.getElementById('search-btn');
    this.viewModeBtn = document.getElementById('view-mode-btn');
    this.garageBtn = document.getElementById('garage-btn');
    this.garageCountEl = document.getElementById('garage-count');
    this.isPhotoMode = true;

    // Modals
    this.inspectorModal = document.getElementById('inspector-modal');
    this.inspectorContent = document.getElementById('inspector-content');
    this.searchModal = document.getElementById('search-modal');
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.garageModal = document.getElementById('garage-modal');
    this.garageContent = document.getElementById('garage-content');

    this.init();
  }

  init() {
    this.renderMinimap();
    this.renderHighway();
    this.setupEventListeners();
    this.setupRevTouchListeners();
    this.setupScrollObserver();
    this.updateGarageBadge();
    this.setupFallbacks();
  }

  renderMinimap() {
    this.minimapLabelsEl.innerHTML = ERAS.map((era, index) => `
      <li class="minimap-item ${index === 0 ? 'active' : ''}" data-era-id="${era.id}" data-index="${index}">
        ${era.name.split(':')[0]} (${era.startYear})
      </li>
    `).join('');

    this.minimapLabelsEl.querySelectorAll('.minimap-item').forEach(item => {
      item.addEventListener('click', () => {
        audioEngine.playClick();
        const eraId = item.dataset.eraId;
        const target = document.getElementById(`era-${eraId}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  renderHighway() {
    let html = '';
    let currentEra = null;
    let stationCounter = 0;

    CARS.forEach((car, index) => {
      // Check if era changed to insert era banner
      if (!currentEra || currentEra.id !== car.eraId) {
        currentEra = ERAS.find(e => e.id === car.eraId);
        if (currentEra) {
          html += `
            <div class="era-banner" id="era-${currentEra.id}" style="--era-accent: ${currentEra.accentColor}">
              <div class="era-banner-years">${currentEra.years}</div>
              <h2 class="era-banner-title">${currentEra.name}</h2>
              <p class="era-banner-desc">${currentEra.description}</p>
            </div>
          `;
        }
      }

      const isRight = (stationCounter % 2 === 1);
      const isSaved = this.garageIds.has(car.id);
      stationCounter++;

      html += `
        <div class="car-station ${isRight ? 'right' : 'left'}" data-year="${car.year}" data-era="${car.eraId}" data-category="${car.category}" id="car-${car.id}">
          <div class="station-marker">
            <span class="station-marker-dot"></span>
            <span>${car.year}</span>
          </div>

          <article class="car-card" data-car-id="${car.id}">
            <div class="car-card-header">
              <div>
                <span class="car-year-badge">${car.year}</span>
                <span class="car-category-pill" style="margin-left: 0.5rem">${car.origin}</span>
              </div>
              <span class="car-category-pill">${car.category}</span>
            </div>

            <h3 class="car-title">${car.name}</h3>
            <div class="car-subtitle">${car.subtitle}</div>

            <div class="car-art-frame rev-trigger" data-car-id="${car.id}" data-sound="${car.soundProfile}" title="Touch & hold image to rev the ${car.name}">
              <span class="photo-overlay-tag">🔊 Touch to Rev</span>
              <img src="${car.photoUrl}" alt="${car.name}" class="car-photo" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';">
              <div class="car-vector-fallback" style="display: none; width: 100%; height: 100%;">
                ${renderCarSvg(car, { isInteractive: true })}
              </div>
            </div>

            <div class="car-specs-grid">
              <div class="spec-item">
                <div class="spec-name">Top Speed</div>
                <div class="spec-val">${car.topSpeed}</div>
              </div>
              <div class="spec-item">
                <div class="spec-name">Horsepower</div>
                <div class="spec-val">${car.power}</div>
              </div>
              <div class="spec-item">
                <div class="spec-name">Engine / Powertrain</div>
                <div class="spec-val">${car.engine}</div>
              </div>
              <div class="spec-item">
                <div class="spec-name">0–100 km/h</div>
                <div class="spec-val">${car.acceleration}</div>
              </div>
            </div>

            <p class="car-tagline">“${car.tagline}”</p>

            <div class="card-actions">
              <button class="btn-details" data-car-id="${car.id}">
                Read History & Specs →
              </button>
              <button class="btn-garage-toggle ${isSaved ? 'saved' : ''}" data-car-id="${car.id}" title="Save to Dream Garage">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      `;
    });

    this.highwayContainer.innerHTML = html;
  }

  setupEventListeners() {
    // Sound FX Toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = audioEngine.toggleMute();
      this.soundToggleBtn.classList.toggle('active', !isMuted);
      this.soundToggleBtn.querySelector('span').textContent = isMuted ? 'Sound: OFF' : 'Sound: ON';
      if (!isMuted) audioEngine.playClick();
    });

    // Cruise Control (Auto-Drive)
    this.cruiseControlBtn.addEventListener('click', () => {
      audioEngine.playClick();
      this.toggleCruiseControl();
    });

    // Search Toggle
    this.searchBtn.addEventListener('click', () => {
      audioEngine.playClick();
      this.openSearchModal();
    });

    // View Mode Toggle (Photos vs Blueprints)
    if (this.viewModeBtn) {
      this.viewModeBtn.addEventListener('click', () => {
        audioEngine.playClick();
        this.isPhotoMode = !this.isPhotoMode;
        this.viewModeBtn.classList.toggle('active', !this.isPhotoMode);
        this.viewModeBtn.querySelector('span').textContent = this.isPhotoMode ? 'Mode: Photos' : 'Mode: Blueprints';
        document.body.classList.toggle('blueprint-mode', !this.isPhotoMode);
      });
    }

    // Dream Garage Toggle
    this.garageBtn.addEventListener('click', () => {
      audioEngine.playClick();
      this.openGarageModal();
    });

    // Filter Buttons
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        audioEngine.playClick();
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.applyFilter(tab.dataset.filter);
      });
    });

    // Highway Delegation (Inspect & Garage)
    this.highwayContainer.addEventListener('click', (e) => {
      const detailsBtn = e.target.closest('.btn-details') || e.target.closest('.car-title');
      if (detailsBtn) {
        const carId = detailsBtn.dataset.carId || detailsBtn.closest('.car-card')?.dataset.carId;
        const car = CARS.find(c => c.id === carId);
        if (car) {
          audioEngine.playClick();
          this.openInspectorModal(car);
        }
        return;
      }

      const garageToggleBtn = e.target.closest('.btn-garage-toggle');
      if (garageToggleBtn) {
        const carId = garageToggleBtn.dataset.carId;
        this.toggleGarageSave(carId, garageToggleBtn);
      }
    });

    // Modal Close buttons & overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn')) {
          audioEngine.playClick();
          modal.classList.remove('active');
          audioEngine.stopThrottleRev();
        }
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        audioEngine.stopThrottleRev();
      } else if (e.key === ' ' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        this.toggleCruiseControl();
      }
    });

    // Search input typing
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
  }

  setupScrollObserver() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScrollUpdate();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  handleScrollUpdate() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

    // Update Top Progress Bar
    this.progressBarEl.style.width = `${(progress * 100).toFixed(1)}%`;

    // Update Minimap Thumb
    if (this.minimapThumbEl) {
      this.minimapThumbEl.style.top = `${(progress * 100).toFixed(1)}%`;
    }

    // Find the car station currently in the center of viewport
    const stations = Array.from(document.querySelectorAll('.car-station'));
    const viewportMiddle = scrollY + window.innerHeight * 0.45;

    let closestStation = null;
    let minDistance = Infinity;

    for (const station of stations) {
      if (station.style.display === 'none') continue;
      const rect = station.getBoundingClientRect();
      const stationTop = rect.top + scrollY;
      const distance = Math.abs(stationTop - viewportMiddle);

      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    }

    if (closestStation) {
      const year = closestStation.dataset.year;
      const eraId = closestStation.dataset.era;
      const era = ERAS.find(e => e.id === eraId);

      // Roll Odometer
      this.odometerYearEl.textContent = year;

      if (era) {
        // Update Era Badge
        this.eraBadgeTextEl.textContent = era.name;
        document.documentElement.style.setProperty('--era-accent', era.accentColor);
        document.documentElement.style.setProperty('--road-stripe', era.roadLine);
        document.body.style.backgroundColor = era.bgGradient;

        // Find highest speed record car up to this year
        const carsUpToYear = CARS.filter(c => c.year <= parseInt(year));
        const maxSpeed = Math.max(...carsUpToYear.map(c => c.topSpeedKmh || 0));
        this.speedometerValEl.textContent = `${Math.round(maxSpeed)} km/h`;

        // Update Minimap active label
        const eraIndex = ERAS.findIndex(e => e.id === eraId);
        document.querySelectorAll('.minimap-item').forEach((item, idx) => {
          item.classList.toggle('active', idx === eraIndex);
        });
      }
    }
  }

  toggleCruiseControl() {
    if (this.cruiseSpeed === 0) {
      this.cruiseSpeed = 1;
      this.cruiseControlBtn.classList.add('active');
      this.cruiseControlBtn.querySelector('span').textContent = 'Cruising (1x)';
      this.startCruiseLoop();
    } else if (this.cruiseSpeed === 1) {
      this.cruiseSpeed = 2.5;
      this.cruiseControlBtn.classList.add('active');
      this.cruiseControlBtn.querySelector('span').textContent = 'Autobahn (2.5x)';
    } else {
      this.cruiseSpeed = 0;
      this.cruiseControlBtn.classList.remove('active');
      this.cruiseControlBtn.querySelector('span').textContent = 'Cruise Control';
      if (this.cruiseAnimId) cancelAnimationFrame(this.cruiseAnimId);
    }
  }

  startCruiseLoop() {
    const loop = () => {
      if (this.cruiseSpeed > 0) {
        window.scrollBy({ top: 3.5 * this.cruiseSpeed, behavior: 'instant' });
        this.cruiseAnimId = requestAnimationFrame(loop);
      }
    };
    this.cruiseAnimId = requestAnimationFrame(loop);
  }

  applyFilter(filter) {
    this.currentFilter = filter;
    const stations = document.querySelectorAll('.car-station');

    stations.forEach(station => {
      const category = station.dataset.category;
      let shouldShow = false;

      if (filter === 'all') shouldShow = true;
      else if (filter === 'supercar' && category === 'supercar') shouldShow = true;
      else if (filter === 'everyday' && category === 'everyday') shouldShow = true;
      else if (filter === 'milestone' && category === 'milestone') shouldShow = true;
      else if (filter === 'electric' && (category === 'electric' || category === 'future')) shouldShow = true;

      station.style.display = shouldShow ? 'flex' : 'none';
    });
  }

  openInspectorModal(car) {
    this.activeInspectedCar = car;
    const isSaved = this.garageIds.has(car.id);

    this.inspectorContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem">
        <div>
          <span class="car-year-badge">${car.year}</span>
          <span class="car-category-pill" style="margin-left: 0.5rem">${car.origin}</span>
          <span class="car-category-pill">${car.category}</span>
          <h2 style="font-size: 2.2rem; font-weight: 900; margin-top: 0.5rem; color: #ffffff">${car.name}</h2>
          <div style="font-size: 1.1rem; color: var(--era-accent)">${car.subtitle}</div>
        </div>
      </div>

      <div class="car-art-frame rev-trigger" data-car-id="${car.id}" data-sound="${car.soundProfile}" style="height: 320px; margin-bottom: 2rem" title="Touch & hold image to rev the engine">
        <span class="photo-overlay-tag">🔊 Touch image to Rev</span>
        <img src="${car.photoUrl}" alt="${car.name}" class="car-photo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';">
        <div class="car-vector-fallback" style="display: none; width: 100%; height: 100%;">
          ${renderCarSvg(car, { isInteractive: false })}
        </div>
      </div>

      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; color: #ffffff">Historical Impact & Story</h3>
      <p style="font-size: 1.05rem; line-height: 1.6; color: #cbd5e1; margin-bottom: 1.5rem">${car.description}</p>

      <div style="background: rgba(255, 255, 255, 0.04); padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 1.5rem">
        <strong style="color: var(--era-accent)">Did You Know?</strong>
        <p style="font-size: 0.95rem; color: #e2e8f0; margin-top: 0.25rem">${car.funFact}</p>
      </div>

      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; color: #ffffff">Key Engineering Innovations</h3>
      <ul class="innovations-list">
        ${car.innovations.map(inv => `<li>${inv}</li>`).join('')}
      </ul>

      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: #ffffff">Complete Technical Data</h3>
      <div class="car-specs-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))">
        <div class="spec-item"><div class="spec-name">Manufacturer</div><div class="spec-val">${car.maker}</div></div>
        <div class="spec-item"><div class="spec-name">Engine</div><div class="spec-val">${car.engine}</div></div>
        <div class="spec-item"><div class="spec-name">Horsepower</div><div class="spec-val">${car.power}</div></div>
        <div class="spec-item"><div class="spec-name">Top Speed</div><div class="spec-val">${car.topSpeed}</div></div>
        <div class="spec-item"><div class="spec-name">Acceleration</div><div class="spec-val">${car.acceleration}</div></div>
        <div class="spec-item"><div class="spec-name">Units Built</div><div class="spec-val">${car.unitsBuilt}</div></div>
        <div class="spec-item"><div class="spec-name">Original Price</div><div class="spec-val">${car.priceOriginal}</div></div>
        <div class="spec-item"><div class="spec-name">Today's Value</div><div class="spec-val">${car.priceToday}</div></div>
      </div>
    `;

    this.inspectorModal.classList.add('active');
  }

  toggleGarageSave(carId, buttonEl) {
    audioEngine.playSeatbeltClick();
    if (this.garageIds.has(carId)) {
      this.garageIds.delete(carId);
      if (buttonEl) {
        buttonEl.classList.remove('saved');
        buttonEl.querySelector('svg').setAttribute('fill', 'none');
      }
    } else {
      this.garageIds.add(carId);
      if (buttonEl) {
        buttonEl.classList.add('saved');
        buttonEl.querySelector('svg').setAttribute('fill', 'currentColor');
      }
    }
    localStorage.setItem('car_history_garage', JSON.stringify([...this.garageIds]));
    this.updateGarageBadge();
  }

  updateGarageBadge() {
    this.garageCountEl.textContent = this.garageIds.size;
  }

  openSearchModal() {
    this.searchInput.value = '';
    this.handleSearch('');
    this.searchModal.classList.add('active');
    setTimeout(() => this.searchInput.focus(), 100);
  }

  handleSearch(query) {
    const q = query.trim().toLowerCase();
    const matches = CARS.filter(car => {
      if (!q) return true;
      return (
        car.name.toLowerCase().includes(q) ||
        car.maker.toLowerCase().includes(q) ||
        car.year.toString().includes(q) ||
        car.tagline.toLowerCase().includes(q) ||
        car.engine.toLowerCase().includes(q) ||
        car.innovations.some(i => i.toLowerCase().includes(q))
      );
    });

    this.searchResults.innerHTML = matches.map(car => `
      <div class="search-result-item" data-car-id="${car.id}">
        <div>
          <strong style="color: #ffffff">${car.name}</strong>
          <span style="color: var(--era-accent); margin-left: 0.5rem; font-family: var(--font-mono)">${car.year}</span>
          <div style="font-size: 0.8rem; color: var(--text-muted)">${car.subtitle}</div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8">${car.topSpeed}</div>
      </div>
    `).join('');

    this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const carId = item.dataset.carId;
        const target = document.getElementById(`car-${carId}`);
        this.searchModal.classList.remove('active');
        if (target) {
          audioEngine.playClick();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  openGarageModal() {
    const savedCars = CARS.filter(c => this.garageIds.has(c.id));

    if (savedCars.length === 0) {
      this.garageContent.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem">
          <div style="font-size: 3rem; margin-bottom: 1rem">🏎️</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffffff">Your Dream Garage is Empty</h3>
          <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto">
            Click the bookmark icon on any vehicle along the highway to save it to your garage and compare specs across automotive history!
          </p>
        </div>
      `;
    } else {
      this.garageContent.innerHTML = `
        <div style="margin-bottom: 1.5rem">
          <h3 style="font-size: 1.8rem; font-weight: 800; color: #ffffff">My Dream Garage (${savedCars.length})</h3>
          <p style="color: var(--text-muted)">Compare specifications and performance across decades of history.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem">
          ${savedCars.map(car => `
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.25rem">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem">
                <span class="car-year-badge">${car.year}</span>
                <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8">${car.topSpeed}</span>
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 700; color: #ffffff">${car.name}</h4>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem">${car.power} • ${car.engine}</div>
              <div class="car-art-frame rev-trigger" data-car-id="${car.id}" data-sound="${car.soundProfile}" style="height: 140px; margin-bottom: 1rem" title="Touch & hold image to rev the engine">
                <span class="photo-overlay-tag">🔊 Touch to Rev</span>
                <img src="${car.photoUrl}" alt="${car.name}" class="car-photo" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';">
                <div class="car-vector-fallback" style="display: none; width: 100%; height: 100%;">
                  ${renderCarSvg(car, { isInteractive: false })}
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem">
                <button class="btn-details" data-car-id="${car.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem">Details</button>
                <button class="btn-garage-toggle saved" data-car-id="${car.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem">Remove</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Wire details / remove buttons
      this.garageContent.querySelectorAll('.btn-details').forEach(b => {
        b.addEventListener('click', () => {
          const car = CARS.find(c => c.id === b.dataset.carId);
          if (car) {
            this.garageModal.classList.remove('active');
            this.openInspectorModal(car);
          }
        });
      });

      this.garageContent.querySelectorAll('.btn-garage-toggle').forEach(b => {
        b.addEventListener('click', () => {
          this.toggleGarageSave(b.dataset.carId);
          this.openGarageModal(); // Refresh view
        });
      });
    }

    this.garageModal.classList.add('active');
  }

  setupRevTouchListeners() {
    this.activeRevTrigger = null;

    const startRev = (frameEl) => {
      if (this.activeRevTrigger) return;
      this.activeRevTrigger = frameEl;
      const soundProfile = frameEl.dataset.sound || 'v8-muscle';

      // Auto enable sound if currently muted so user gets immediate response
      if (audioEngine.isMuted) {
        audioEngine.isMuted = false;
        if (this.soundToggleBtn) {
          this.soundToggleBtn.classList.add('active');
          this.soundToggleBtn.querySelector('span').textContent = 'Sound: ON';
        }
      }

      frameEl.classList.add('is-revving');
      const tag = frameEl.querySelector('.photo-overlay-tag');
      if (tag) tag.textContent = '🔊 Revving Engine...';

      audioEngine.startThrottleRev(soundProfile);
    };

    const stopRev = () => {
      if (!this.activeRevTrigger) return;
      const frameEl = this.activeRevTrigger;
      this.activeRevTrigger = null;

      frameEl.classList.remove('is-revving');
      const tag = frameEl.querySelector('.photo-overlay-tag');
      if (tag) tag.textContent = '🔊 Touch to Rev';

      audioEngine.stopThrottleRev();
    };

    // Pointer events on document level to capture touch and mouse flawlessly
    document.addEventListener('pointerdown', (e) => {
      const trigger = e.target.closest('.rev-trigger');
      if (trigger) {
        if (e.pointerType === 'touch') {
          e.preventDefault();
        }
        startRev(trigger);
      }
    }, { passive: false });

    document.addEventListener('pointerup', stopRev);
    document.addEventListener('pointercancel', stopRev);
    window.addEventListener('blur', stopRev);
  }

  setupFallbacks() {
    // IntersectionObserver fallback for browsers lacking CSS Scroll-Driven Animations
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            entry.target.style.opacity = Math.min(1, 0.4 + ratio * 0.6);
            entry.target.style.transform = `translateY(${Math.max(0, (1 - ratio) * 40)}px) scale(${0.94 + ratio * 0.06})`;
          }
        }
      }, {
        threshold: Array.from({ length: 21 }, (_, i) => i / 20)
      });

      document.querySelectorAll('.car-card').forEach(el => observer.observe(el));
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new CarHistoryApp();
});
