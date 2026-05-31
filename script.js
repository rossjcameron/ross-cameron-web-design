/* ============================================================
   Ross Cameron — Affordable Web Design · shared script
   ============================================================ */
(function(){
  "use strict";

  /* ---- Nav: scroll state + mobile toggle ---- */
  var nav = document.getElementById('nav');
  if(nav){
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
  var ham = document.getElementById('hamburger');
  var links = document.getElementById('navLinks');
  if(ham && links){
    ham.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && reveals.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12});
    reveals.forEach(function(el,i){ el.style.transitionDelay = (i%4*60)+'ms'; io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- FAQ accordion ---- */
  var faqWrap = document.getElementById('faqWrap');
  if(faqWrap){
    faqWrap.addEventListener('click', function(e){
      var q = e.target.closest('.faq-q'); if(!q) return;
      var item = q.parentElement;
      var ans = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      faqWrap.querySelectorAll('.faq').forEach(function(f){
        f.classList.remove('open'); f.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){ item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    });
  }

  /* ---- Before / After slider ---- */
  document.querySelectorAll('.ba').forEach(function(ba){
    var before = ba.querySelector('.ba-before');
    var handle = ba.querySelector('.ba-handle');
    var range  = ba.querySelector('input[type=range]');
    function set(v){
      before.style.width = v + '%';
      handle.style.left = v + '%';
    }
    if(range){ range.addEventListener('input', function(){ set(range.value); }); set(range.value); }
  });

  /* ---- Demo modal (examples page) ---- */
  var demos = window.RC_DEMOS || [];
  var exGrid = document.getElementById('exGrid');
  var modal = document.getElementById('modal');

  function miniMock(d){
    return '<div class="mini">'+
      '<div class="mini-bar"><i></i><i></i><i></i></div>'+
      '<div class="mini-hero '+d.tag+'"><div class="t"></div><div class="s"></div><div class="s" style="width:55%"></div><div class="b"></div></div>'+
      '<div class="mini-cards"><div class="c"></div><div class="c"></div><div class="c"></div></div>'+
    '</div>';
  }

  if(exGrid && demos.length){
    demos.forEach(function(d,i){
      var card = document.createElement('div');
      card.className = 'ex-card reveal';
      card.innerHTML =
        '<div class="ex-thumb '+d.tag+'">'+miniMock(d)+'</div>'+
        '<div class="ex-body">'+
          '<div class="ex-kicker">'+d.kicker+'</div>'+
          '<h3>'+d.title+'</h3>'+
          '<p>'+d.desc+'</p>'+
          '<span class="concept">Example concept website</span>'+
          '<button class="view-demo" data-i="'+i+'">View demo '+
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'+
          '</button>'+
        '</div>';
      exGrid.appendChild(card);
    });
    if('IntersectionObserver' in window){
      var io2 = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target);}});},{threshold:.12});
      exGrid.querySelectorAll('.reveal').forEach(function(el){io2.observe(el);});
    }
  }

  function openModal(i){
    var d = demos[i]; if(!d || !modal) return;
    modal.querySelector('#modalPreview').className = 'modal-preview ' + d.tag;
    modal.querySelector('#modalPreview').innerHTML = miniMock(d);
    modal.querySelector('#modalKicker').textContent = d.kicker + ' website';
    modal.querySelector('#modalTitle').textContent = d.title;
    modal.querySelector('#modalDesc').textContent = d.desc;
    modal.querySelector('#modalFeats').innerHTML = d.feats.map(function(f){
      return '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'+f+'</li>';
    }).join('');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){ if(!modal) return; modal.classList.remove('show'); document.body.style.overflow=''; }

  if(exGrid){ exGrid.addEventListener('click', function(e){ var b=e.target.closest('.view-demo'); if(b) openModal(+b.dataset.i); }); }
  if(modal){
    modal.querySelector('#modalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
    var mc = modal.querySelector('#modalCta'); if(mc) mc.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
  }
})();
