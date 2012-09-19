/* Sorry for all the mess, this is how I keep my notes on code. */
/* First off: http://xaxor.com/images/I-have-no-idea-what-Im-doing-meme/I-have-no-idea-what-Im-doing-meme6.jpg */


/* Solid sortable vs Kursorin mukaan toimiva sortable:
Ensiajattelemalta tuntuis siltä että kun raahataan haamua ja tapahtumat reagoi hiiren sijaintiin, on helpompi mieltää raahaustoiminto peruutettavaks. Eli solid sortablea pitäs varmaan käyttää ennemmin tilanteissa joissa undolle ei oo tarvetta ja raahauksen canceloinnilla ei oo niin väliä. Ainakin kaikki Applen esimerkit mitä keksin on juurikin semmosia että lista on hyvin simppeli, eikä voi oikein sattua vahinkoja, niinkun finderin sivupalkin sorttaus, safarin tabit ja vaikka iOS:llä kontaktien suosikkien järjestäminen. Haamu taas toimii ilmeisesti paremmin monimutkasemmaks miellettävissä (ei välttämättä oikeesti monimutkasemmissa) tilanteissa, niinkun tiedostoja siirreltäessä, tai vaikkapa automatorin actioneja keskenään järjestettäessä.

Ongelmallisia toteutuksia:
Esim. Transmitin ja Automatorin tapa järjestää tuntuu efektiltä efektin takia, eikä varsinaisesti käyttökokemusta selkeyttävältä, kun ensin näytetään indikaattori että mihin ollaan haamua tiputtamassa, eikä haamun alkuperää indikoida mitenkään, vaan alkuperänen elementti on paikallaan saman näkösenä kun normaalisti ja tiputuksen jälkeen haamu vaan katoaa ja alkuperänen elementti animoidaan uudelle paikalleen.)

*/


/* kun drag alkaa, otetaan kaikkien listan itemien top left ja bottom right koordinaatit objektiin talteen, kun drägätään, vertaillaan raahattavan elementin top left ja bottom right rectanglen perusteella että miten istan elementtejä pitäs liikutella, logiikasta löpinät tuolla alempana. */

/* Kuvitellaan että samalla voi initata monta sortablee listaa joiden välillä voi raahailla elementtejä, kaikki keskenään pelaavat listat ois sortable objektissa, ehjis johkis jotain tommosta. Ehkä parempi ratkasu ois irrottaa raahaus ja droppailu kokonaan toisistaan niinku tossa natiivi drag & droppia käyttävässä smooth sortablessa, jotta se ei ois mistään initeistä tai semmosista kiinni mihkä voi dropata mitäkin, vaan joku saman tyylinen kun jqueryssä tai html5 drag dropissa että raahattavalla on joku property jonka perusteella dropzone kattoo että hyväksyykö se tämmöstä ja toimii sen mukaan. */

/* peruslogiikka menis näin:
kun raahattavan elementin keskikohta ylittää puolivälin tyhjän kohdan kauimmaisen laidan ja overlappaavan elementin kauimmaisen laidan välillä, siirretään overlappaavaa elementtiä raahattavan elementin korkeuden verran tyhjän paikan suuntaan

Kun listaan raahataan muualta uus elementti, lisätään elementin tyhjä tila listan pohjalle ja aletaan sortata normaalin algoritmin mukaan.

Kun listasta raahataan elementti pois, tehdään aukko siihen kohti mitä sitä alettiin raahata, jotta jos raahaus peruutetaan, raahattava elementti menee takas sille paikalle jossa se oli.
*/

/* Sorttauksen pitäs olla iteratiivista, eli tarkistetaan onko raahattavan elementtin keskikohta aukon ja seuraavan elementin kauimmaisen reunan puolivälin yli, jos on, siirretään overlappaavaa elementtiä (isketään absoluuttiset/relative/transform koodrinaatit ja annetaan css transitoiden hoitaa visuaalinen siirto) ja tarkistetaan koordinaatit uudestaan, että tarviiko siirtää uutta elementtiä. (Eli jos yhdellä hiiren liikutuksen päivityksellä raahattava elementti onkin siirtyny useemman elementin matkan johkin suuntaan) Jos uutta sorttausta ei tarvi tehdä, voi lopettaa iteroimisen, iteroidaan niin kauan kunnes ollaan tilanteessa jossa raahattava elementti on tyhjän kohdan päällä siten että siirtoja ei tarvi tehdä. Varsinaisten dom elementtien koordinaatit pitäs ehkä päivittää vasta kun iterointi on käyty loppuun, eikä joka iteraatiolla.  */

/* Kun jotain elementtiä, tai sen sorttauskoordinaatteja siirretään, pitäs varmaan pitää kirjaa kans tyhjästä paikasta ja siirtää sitä sortattavan elementin verran vastakkaiseen suuntaan, jotta on koko ajan selvillä tyhjän kohdan ylä/alalaita johka verrata sorttausalgoritmilla. Ehkä sen tyhjän kohdan träkkäyksen pitäs olla siis raahattavan elementin laskennalliset koordinaatit, jollonka kun päästää raahattavasta elementistä irti, niin sen vois transitioida suoraan siitä kohden missä se on, sinne missä sen laskennalliset koordinaatit on. */

/* Elementtien määrät ja koodrinaatit pitäs lukea uudestaan aina kun raahaus alotetaan, jotta ei tarvi olettaa elementtien kokojen pysyvän samoina. */

/* Kun elementtiä raahataan, järjestäminen ja koordinaatit pitäs pitää erillään siitä missä ja miten varsinaisia html listalementtejä animoidaan, jotta sorttaus toimii realtimena riippumatta animoinneista. Elementtejä siis pitäis animoidan vaan sen mukaan mihin ne halutaan sorttausalgoritmin mukaan, eikä sortata varsinaisten elementtien perusteella, vaan laskettujen koordinaattien perusteella.

Elementtien sorttaus siis position:absolute koordinaatteina tai transformeina ja animaatiot css transitioilla. Sorttauksen laskenta asetettujen kohdekoordinaattien perusteella, joihin elementit pyrkii. */


/**
 * debounce
 * @param {integer} milliseconds This param indicates the number of milliseconds
 *     to wait after the last call before calling the original function .
 * @return {function} This returns a function that when called will wait the
 *     indicated number of milliseconds after the last call before
 *     calling the original function.
 */
Function.prototype.debounce = function (milliseconds) {
    var baseFunction = this,
        timer = null,
        wait = milliseconds;

    return function () {
        var self = this,
            args = arguments;

        function complete() {
            baseFunction.apply(self, args);
            timer = null;
        }

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(complete, wait);
    };
};

/**
* throttle
* @param {integer} milliseconds This param indicates the number of milliseconds
*     to wait between calls before calling the original function.
* @return {function} This returns a function that when called will wait the
*     indicated number of milliseconds between calls before
*     calling the original function.
*/
Function.prototype.throttle = function (milliseconds) {
    var baseFunction = this,
        lastEventTimestamp = null,
        limit = milliseconds;

    return function () {
        var self = this,
            args = arguments,
            now = Date.now();

        if (!lastEventTimestamp || now - lastEventTimestamp >= limit) {
            lastEventTimestamp = now;
            baseFunction.apply(self, args);
        }
    };
};


$(document).ready(function() {
  /*Sortable is an object with stuff
    sortable:
      node:
      items: childern of sortable.node
      transitionDuration: 
      init: should maybe bind events and stuff here
      start: when dragging starts, go through the items, add necessary inline styles and read their properties for sorting
      drag: the meat, on each drag event, sort stuff around
      finish: write changed order to dom and stuff
  */

  //TODO: remove dependency on the ui object so any draggable library could be used
  //TODO: 

  var sortable = {
    node: $('.smooth-sortable')[0],
    items: [],
    transitionDuration: 0,
    init: function(options) {
      sortable.transitionDuration = (function() {
        var item = $(sortable.node).children(':first');
        var duration =
          item.css('-webkit-transition-duration') ||
          item.css('-moz-transition-duration') ||
          item.css('-ms-transition-duration') ||
          item.css('-o-transition-duration') ||
          item.css('transition-duration');
        if (duration) {
          return parseInt(duration.substring(2, 5));
        } else {
          return sortable.transitionDuration;
        }
      })()
    },
    start: function(event, ui) {
      //build list of sortable items
      //dom element coordinates and sorting coordinates need to be decoupled so the sorting and animations are not dependent on each other

      sortable.running = false;

      $('.smooth-sortable li').each(function(i) {
        $this = $(this);
        if (this == event.target){
          sortable.dragItemIndex = i;
        }
        sortable.items[i] = {};
        sortable.items[i].top = $this.offset().top;
        sortable.items[i].height = $this.outerHeight();
        sortable.items[i].bottom = sortable.items[i].top + sortable.items[i].height;
        sortable.items[i].node = this;
        sortable.items[i].displacement = 0;
        $this.css({
          'top': '0px',
          'position': 'relative'
        });
      });

      //TODO: inconsistency in how we get sortable.top and sortable.height, will get borked if sortable.node has padding
      sortable.top = sortable.items[0].top;
      sortable.bottom = sortable.items[sortable.items.length - 1].bottom;
      sortable.height = $(sortable.node).outerHeight();

      console.log('dragstart with item ' + sortable.dragItemIndex);
    },
    drag: function(event, ui) {
      /*
      #The basic flow goes like this:
      1. find the items on top and below the empty space
      2. calculate sorting thresholds upward and downward from the empty space
      3. if up, sort up, if down, sort down
      4. iterate until the helper midpoint is not beyond any threshold
      5. once sorting is complete, update dom nodes with new coordinates (and let css transitions take care of any animation)
        5.1 prevent new drag operations until animations are over
      */

      if (sortable.running){
        console.log('throttle');
      } else {
        //TODO: sortable.running feels inelegant, using .throttle for functions feels more readable
        sortable.running = Date.now();

        var dragItem = sortable.items[sortable.dragItemIndex];

        while (sortable.running) { 

          if (sortable.dragItemIndex != 0){
            var topItem = sortable.items[sortable.dragItemIndex - 1];
          } else {
            var topItem = {};
            topItem.bottom = sortable.top;
            topItem.top = sortable.top-sortable.height;
            topItem.height = sortable.height;
          }

          if (sortable.dragItemIndex != sortable.items.length - 1) {
            var bottomItem = sortable.items[sortable.dragItemIndex + 1];
          } else {
            var bottomItem = {};
            bottomItem.top = sortable.bottom;
            bottomItem.bottom = sortable.bottom + sortable.height;
            bottomItem.height = sortable.height;
          }

          var dragMiddle = $(event.target).offset().top + ($(event.target).outerHeight() / 2);

          var topThreshold = (topItem.top + bottomItem.top) / 2;
          var bottomThreshold = (topItem.bottom + bottomItem.bottom) / 2;

          if (dragMiddle >= bottomThreshold) {

            bottomItem.displacement -= dragItem.height;
            $(bottomItem.node).css('top', bottomItem.displacement);

            sortable.items[sortable.dragItemIndex] = bottomItem;
            sortable.items[sortable.dragItemIndex].top = dragItem.top;
            sortable.items[sortable.dragItemIndex].bottom = sortable.items[sortable.dragItemIndex].top + bottomItem.height;

            sortable.items[sortable.dragItemIndex + 1] = dragItem;
            sortable.items[sortable.dragItemIndex + 1].top = bottomItem.bottom ;
            sortable.items[sortable.dragItemIndex + 1].bottom = sortable.items[sortable.dragItemIndex + 1 ].top + sortable.items[sortable.dragItemIndex + 1].height;
            sortable.items[sortable.dragItemIndex + 1].displacement += bottomItem.height;

            sortable.dragItemIndex++;

          } else if (dragMiddle < topThreshold){

            topItem.displacement += dragItem.height;
            $(topItem.node).css('top', topItem.displacement);

            var tempTop = topItem.top;

            sortable.items[sortable.dragItemIndex] = topItem;
            sortable.items[sortable.dragItemIndex].bottom = dragItem.bottom;
            sortable.items[sortable.dragItemIndex].top = dragItem.bottom - topItem.height;

            sortable.items[sortable.dragItemIndex - 1] = dragItem;
            sortable.items[sortable.dragItemIndex - 1].top = tempTop;
            sortable.items[sortable.dragItemIndex - 1].bottom = tempTop + dragItem.height;
            sortable.items[sortable.dragItemIndex - 1].displacement -= topItem.height;

            sortable.dragItemIndex--;

          } else {
            sortable.running = false;
          }
        }
      }
    },
    finish: function(event, ui) {
      // Disable dragging while animating.        
      $('.smooth-sortable li').draggable('disable');

      $(sortable.items[sortable.dragItemIndex].node).css({
        'top': sortable.items[sortable.dragItemIndex].displacement,
        'z-index': 9999
      });

      setTimeout(function() {
        // Keep the dragged item on top of other items during transition and then reset the Z-Index
        $(sortable.items[sortable.dragItemIndex].node)[0].style.zIndex = '';

        // Rewrite the dom to match the new order after everthing else is done.
        sortable.items.forEach(function(item, i, items) {
          $(item.node).css('top', 0);
          $('.smooth-sortable').append(item.node);
        });

        // Re-enable dragging.
        $('.smooth-sortable li').draggable('enable');
      }, sortable.transitionDuration);
    }
  };


  sortable.init();
  $('.smooth-sortable li').draggable(
    {
      axis: 'y',
      containment: 'parent',
      scroll: 'true',
      helper: 'original',
      start: sortable.start,
      drag: sortable.drag.throttle(17), //run drag handler at maximum every 17ms, that's about 60fps
      stop: sortable.finish
    }
  );
});
