/* ─────────────────────────────────────────────────────────────
 * CodeMind Premium HTML Report JavaScript (Browser Interactions)
 * ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initGauges();
  initCharts();
  initCollapsibles();
  initCodeFormatting();
  initCodeCopy();
  initCountUp();
});

/**
 * Persists and manages dark/light modes
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('codemind-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('codemind-theme', theme);
    
    // Update button icons
    const sunIcon = toggleBtn.querySelector('.sun-icon');
    const moonIcon = toggleBtn.querySelector('.moon-icon');
    if (theme === 'dark') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  };

  // Set initial theme
  setTheme(getPreferredTheme());

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
    
    // Redraw charts to refresh static canvas/SVG configurations if needed
    initCharts();
  });
}

/**
 * Animates scorecard circular gauges
 */
function initGauges() {
  const rings = document.querySelectorAll('.gauge-ring');
  rings.forEach(ring => {
    const val = parseFloat(ring.getAttribute('data-value') || '0');
    const r = parseFloat(ring.getAttribute('r') || '40');
    const circumference = 2 * Math.PI * r;
    
    // Reset ring stroke properties
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
    
    // Trigger paint before animating
    setTimeout(() => {
      const offset = circumference - (Math.min(val, 100) / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }, 150);
  });
}

/**
 * Initializes and draws clean responsive SVG Charts dynamically
 */
function initCharts() {
  // 1. Severity Distribution Donut Chart
  const severityChart = document.getElementById('severityDonut');
  if (severityChart) {
    const critical = parseInt(severityChart.getAttribute('data-critical') || '0', 10);
    const high = parseInt(severityChart.getAttribute('data-high') || '0', 10);
    const medium = parseInt(severityChart.getAttribute('data-medium') || '0', 10);
    const low = parseInt(severityChart.getAttribute('data-low') || '0', 10);

    const data = [
      { label: 'Critical', value: critical, color: 'var(--critical)' },
      { label: 'High', value: high, color: 'var(--high)' },
      { label: 'Medium', value: medium, color: 'var(--medium)' },
      { label: 'Low', value: low, color: 'var(--low)' }
    ];
    drawDonutChart('severityDonut', data);
  }

  // 2. Scores Bar Chart
  const scoresChart = document.getElementById('scoresBar');
  if (scoresChart) {
    const quality = parseInt(scoresChart.getAttribute('data-quality') || '100', 10);
    const security = parseInt(scoresChart.getAttribute('data-security') || '100', 10);
    const performance = parseInt(scoresChart.getAttribute('data-performance') || '100', 10);
    const maintainability = parseInt(scoresChart.getAttribute('data-maintainability') || '100', 10);

    const data = [
      { label: 'Quality', value: quality, color: 'var(--primary)' },
      { label: 'Security', value: security, color: 'var(--critical)' },
      { label: 'Performance', value: performance, color: 'var(--primary)' },
      { label: 'Maintainability', value: maintainability, color: 'var(--gold)' }
    ];
    drawBarChart('scoresBar', data);
  }
}

function drawDonutChart(elementId, data) {
  const svg = document.getElementById(elementId);
  if (!svg) return;
  svg.innerHTML = ''; 

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 35;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * radius;

  // Background ring
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', cx);
  bgCircle.setAttribute('cy', cy);
  bgCircle.setAttribute('r', radius);
  bgCircle.setAttribute('fill', 'transparent');
  bgCircle.setAttribute('stroke', 'var(--border-color)');
  bgCircle.setAttribute('stroke-width', '8');
  svg.appendChild(bgCircle);

  if (total === 0) {
    // If no bugs, draw a green check/success donut
    bgCircle.setAttribute('stroke', 'var(--success)');
    return;
  }

  let currentOffset = 0;

  data.forEach(item => {
    const percentage = item.value / total;
    if (percentage === 0) return;

    const strokeLength = percentage * circumference;
    const strokeSpace = circumference - strokeLength;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'transparent');
    circle.setAttribute('stroke', item.color);
    circle.setAttribute('stroke-width', '8');
    circle.setAttribute('transform', 'rotate(-90 50 50)');
    circle.setAttribute('stroke-dasharray', `${strokeLength} ${strokeSpace}`);
    circle.setAttribute('stroke-dashoffset', -currentOffset);
    circle.style.transition = 'stroke-dashoffset 1s ease';
    
    // Add simple title for hover detail
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${item.label}: ${item.value} (${Math.round(percentage * 100)}%)`;
    circle.appendChild(title);

    svg.appendChild(circle);
    currentOffset += strokeLength;
  });
}

function drawBarChart(elementId, data) {
  const svg = document.getElementById(elementId);
  if (!svg) return;
  svg.innerHTML = '';

  const width = 360;
  const height = 180;
  const paddingLeft = 36;
  const paddingBottom = 28;
  const paddingTop = 20;
  const paddingRight = 16;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Grid Ticks
  const gridTicks = [0, 50, 100];
  gridTicks.forEach(tick => {
    const y = paddingTop + chartH - (tick / 100) * chartH;

    // Grid Line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', y);
    line.setAttribute('x2', width - paddingRight);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'var(--border-color)');
    line.setAttribute('stroke-width', '0.5');
    svg.appendChild(line);

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', paddingLeft - 8);
    text.setAttribute('y', y + 3.5);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', 'var(--text-muted)');
    text.setAttribute('font-size', '9');
    text.setAttribute('font-weight', '500');
    text.textContent = tick;
    svg.appendChild(text);
  });

  const barSpacing = chartW / data.length;
  const barW = barSpacing * 0.45;

  data.forEach((item, index) => {
    const barH = (item.value / 100) * chartH;
    const x = paddingLeft + index * barSpacing + (barSpacing - barW) / 2;
    const y = paddingTop + chartH - barH;

    // Bar background (for cleaner aesthetic look)
    const barBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barBg.setAttribute('x', x);
    barBg.setAttribute('y', paddingTop);
    barBg.setAttribute('width', barW);
    barBg.setAttribute('height', chartH);
    barBg.setAttribute('rx', '4');
    barBg.setAttribute('fill', 'var(--border-color)');
    barBg.setAttribute('opacity', '0.15');
    svg.appendChild(barBg);

    // Dynamic bar fill
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', paddingTop + chartH); // animate from bottom
    rect.setAttribute('width', barW);
    rect.setAttribute('height', '0');
    rect.setAttribute('rx', '4');
    rect.setAttribute('fill', item.color);
    svg.appendChild(rect);

    // Animate bar height
    setTimeout(() => {
      rect.setAttribute('y', y);
      rect.setAttribute('height', barH);
      rect.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 50);

    // Score Text value
    const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valText.setAttribute('x', x + barW / 2);
    valText.setAttribute('y', y - 6);
    valText.setAttribute('text-anchor', 'middle');
    valText.setAttribute('fill', 'var(--text-primary)');
    valText.setAttribute('font-weight', '700');
    valText.setAttribute('font-size', '9.5');
    valText.textContent = item.value;
    svg.appendChild(valText);

    // Category Label on X axis
    const lblText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lblText.setAttribute('x', x + barW / 2);
    lblText.setAttribute('y', paddingTop + chartH + 16);
    lblText.setAttribute('text-anchor', 'middle');
    lblText.setAttribute('fill', 'var(--text-secondary)');
    lblText.setAttribute('font-weight', '500');
    lblText.setAttribute('font-size', '9.5');
    lblText.textContent = item.label;
    svg.appendChild(lblText);
  });
}

/**
 * Handles findings expansion and collapsing
 */
function initCollapsibles() {
  const triggers = document.querySelectorAll('.collapsible-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.issue-card');
      if (!card) return;
      
      const content = card.querySelector('.collapsible-content');
      const chevron = card.querySelector('.chevron-icon');
      
      if (content) {
        if (content.classList.contains('expanded')) {
          content.classList.remove('expanded');
          if (chevron) chevron.classList.remove('rotated');
        } else {
          content.classList.add('expanded');
          if (chevron) chevron.classList.add('rotated');
        }
      }
    });
  });
}

/**
 * Inlines line numbers for premium file reading
 */
function initCodeFormatting() {
  const codeBlocks = document.querySelectorAll('code.language-js');
  codeBlocks.forEach(block => {
    const rawHtml = block.innerHTML;
    const lines = rawHtml.split('\n');
    
    // Remove last empty line if present
    if (lines.length > 1 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    
    const formattedHtml = lines.map((line, idx) => {
      return `
        <div class="code-line flex items-stretch">
          <span class="line-number font-mono text-[10px] w-9 min-w-[36px] inline-block select-none text-right pr-2.5 mr-3 font-semibold">${idx + 1}</span>
          <span class="line-content flex-1 pr-4 whitespace-pre-wrap break-all">${line || ' '}</span>
        </div>
      `;
    }).join('');
    
    block.innerHTML = formattedHtml;
  });
}

/**
 * Handles copy-to-clipboard actions on code block elements
 */
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering collapsible click
      
      const codeContainer = btn.closest('.code-container');
      if (!codeContainer) return;
      const codeEl = codeContainer.querySelector('code');
      if (!codeEl) return;

      // Extract raw code text without line numbers
      const lines = codeEl.querySelectorAll('.line-content');
      let text = '';
      if (lines.length > 0) {
        text = Array.from(lines).map(line => line.textContent).join('\n');
      } else {
        text = codeEl.textContent || '';
      }

      navigator.clipboard.writeText(text).then(() => {
        // Swap icon/text briefly to show success
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                           <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                         </svg>`;
        btn.classList.add('bg-emerald-950/40', 'border-emerald-500/30');
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('bg-emerald-950/40', 'border-emerald-500/30');
        }, 1800);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

/**
 * Animated count-up for statistics numbers on page load
 */
function initCountUp() {
  const elements = document.querySelectorAll('.count-up');
  elements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    if (window.matchMedia('print').matches) {
      el.textContent = target;
    } else {
      setTimeout(() => {
        animateNumber(el, target);
      }, 150);
    }
  });
}

function animateNumber(element, target) {
  let start = 0;
  const duration = 1200; // ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out quad
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * target);
    
    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
