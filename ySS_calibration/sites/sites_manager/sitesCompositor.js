
class compositorInLine{

    constructor(){
        this.parent = -1;
        this.name = 'in line';

        this.startScale = 0.129;
        
    }

    setParent = ( parent ) =>{ this.parent = parent; }
    
    mount = () => {
        this.updateRootSize();
        this.buildBaseTails();
    }
    
    updateRootSize = () => {
        this.rootSize = {
            w: this.parent.divRoot.width(),
            h: this.parent.divRoot.height()
        };        
    }

    onWindowResize = ( w, h ) => {
        if( this.rootSize == undefined ) return 0;
        this.updateRootSize();
        this.parent.pages.forEach((p,i) => {
            $(`#siteTile${i}`).css({
                'width':`${this.rootSize.w}px`,
                'height':`${this.rootSize.h}px`
            });

/*            #siteTile${Id} {
                        transform-origin: top left;
                        scale:${this.startScale};
                
                        position: absolute;
                        left:${pLeft*this.startScale}px; top:${pTop*this.startScale}px;
                        border: solid 1px orange;
                        background-color: white;

                        overflow-y: auto;
                    }
                        */
        });


    }
    

    moveGrid( moveFrom = 0 ){
        const $squares = aajs.utils.$('.siteTitle');

        function animateGrid() {
            aajs.animate($squares, {
                scale: [
                    { to: [1, 1.1] },
                    { to: 1 }
                ],
                boxShadow: [
                    { to: '0 0 1rem 0 currentColor' },
                    { to: '0 0 0rem 0 currentColor' }
                ],
                delay: aajs.stagger(200, {
                    grid: [7, 6],
                    from: moveFrom
                }),
                //onComplete: animateGrid,
                loop: false,
                //reversed: true
            });
        }

        animateGrid();
    }

    buildBaseTails = () => {
        let pages = this.parent.pages; 
        let dr = this.parent.divRoot;
        let tikScreen = {
            w: this.rootSize.w/1.0,
            h: this.rootSize.h / 1.0
        };
        let p = 0;
        let isBy = 1.0/this.startScale;
        let intIsBy = parseInt(isBy)+1;
 
        setTimeout(function(){
            $('#pHeader').hide();
        },1000);
        
        
        setTimeout(()=>{
            this.moveGrid(0);

        }, 2000 );
 
        for( let y=0; y<intIsBy; y++ ){ 
            for( let x=0; x<(intIsBy-1); x++ ){
                if( p >= this.parent.pages.length ){
                    return 0;
                }

                dr.append(
                    this.getTail( p, x*(tikScreen.w*1.1), y*(tikScreen.h*1.1) )
                );

                
                //if( [ 'iloo nav', 'basic sail', 'Wiki','blank','test module site' ].indexOf( pages[p].getName ) > -1){
                if(  pages[p].getName == 'Sites manager' ){
                     console.log("p skipp:"+p+" "+pages[p].getName);
                }else{
                    console.log("p:"+p+" "+pages[p].getName);
                    try{                    
                        $(`#htmlDyno${p}`).html( pages[p].getHtml );
                    }catch(e){
                        console.error("error but ok getHtml   ", pages[p].getName,e);
                    }
                    try{                    
                        $(`#svgDyno${p}`).html( pages[p].svgDyno );
                    }catch(e){
                        console.error("error but ok svgDyno    ", pages[p].getName,e);
                    }

                    let pNo = p;
                    setTimeout(()=>{
                        pages[pNo].getHtmlAfterLoad();
                        pages[pNo].svgDynoAfterLoad();
                        
                        $(`#siteMask${pNo}`).click( ()=>{
                            this.tailClick( pNo );
                        } );                   
                    

                    },500);
                }
                p++;
            }
        }
    }

    tailClick = ( pNo ) =>{
        let scaleNow = $(`#siteTile${pNo}`).css('scale');
        console.log('tailClick '+pNo+` in scale now: ${scaleNow}`);


        // put down useNow 
        for( let t=0,tc=this.parent.pages.length; t<tc; t++ ){
            if( $(`#siteTile${t}`).attr('useNow') == '1' ){
                $(`#siteTile${t}`).attr({ 'useNow': '0'});
            
                $(`#siteMask${t}`).show().css('opacity','20%');

                ajs( aajs.utils.$(`#siteTile${t}`), {
                    transform: `scale(${$(`#siteTile${t}`).attr('orgScale')*6.7})`,
                    'transform-origin': 'top left',
                    top:$(`#siteTile${t}`).attr('orgTop'),
                    left:$(`#siteTile${t}`).attr('orgLeft'),
                    'z-index':8000,
                    duration: 200,
                    easing: 'easeInOutQuad' // Easing function
                });

                setTimeout(()=>{this.moveGrid( t );}, 250);
                
            }
        }

        if( 1 ){
            // selected one comming front 

            console.log('tail resize to 100%');
            //$(`#siteTile${pNo}`).css('transform','scale(1.0)');
            //$(`#siteTile${pNo}`).css({
            //    'left': 0,
            //    'top':0
            //});
            $(`#siteTile${pNo}`).attr({
                'useNow': '1',
                'orgSet': '1',
                'orgScale': scaleNow,
                'orgTop': $(`#siteTile${pNo}`).css('top'),
                'orgLeft': $(`#siteTile${pNo}`).css('left'),
            });
            $(`#siteTile${pNo}`).css('z-index', 8001);

            ajs( aajs.utils.$(`#siteTile${pNo}`), {
                scale: 1.0/scaleNow,
                top:0,
                left:0,
                duration: 300,
                easing: 'easeInOutQuad' // Easing function
            });

            ajs( aajs.utils.$(`#siteMask${pNo}`), {
                duration: 300,        // Animation duration of 800ms
                opacity: 0, // Animate opacity to 0
                complete: function(anim) {
                    // Optional: Set display to 'none' after animation completes to fully remove from layout
                    $(`#siteMask${pNo}`).hide();
                }
            });
            

        }


    }

    getTail( Id, x, y ){
        let margin = 1.1;
        let pTop = ( Id*(this.rootSize.h*margin) );
        let pTopS = pTop*this.startScale;
        let pLeft = margin;

        if( pTopS > (this.rootSize.h ) ){
            let overCount = parseInt( pTopS / this.rootSize.h/margin);
            pLeft+= (overCount)*this.rootSize.w*margin;

            pTop-= (this.rootSize.h*margin)*(overCount)/this.startScale;
            //if( pTop < 0 ) pTop = 0;
        }
        
        //left:${pLeft*this.startScale}px; top:${pTop*this.startScale}px;

        return `<div
            id="siteTile${Id}"
            class="siteTitle"
            >   
                <div style="position:absolute;border:solid 1px yellow;">
                    siteTile${Id}
                </div>
                <div id="siteMask${Id}" style="z-index:8000;min-width:100%;min-height:100%;position: absolute;background-color: rgba(0,100,0,0.5);">
                    siteMask
                </div>
                <div id="htmlDyno${Id}" style="
                    position:absolute;
                     z-index:1;
                     min-width:100vw;
                "></div>
                <div id="svgDyno${Id}" style="
                    display: inline; 
                    transform: rotate(0deg);

                    
                "></div>
                <style>
                    #siteTile${Id} {
                        transform-origin: top left;
                        scale:${this.startScale};
                
                        position: absolute;
                        left:${x*this.startScale}px; top:${y*this.startScale}px;
                        border: solid 1px orange;
                        background-color: white;
                        width:${this.rootSize.w}px;
                        height:${this.rootSize.h}px;

                        overflow-y: auto;
                    }
                    #svgDyno${Id} svg {
                        height: 100%;
                        display: block;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 0;
                        text-shadow: none !important;
                        /* -webkit-filter: grayscale(100%); */
                        /* filter: grayscale(100%); */
                    }
                </style>
            </div>`;
    }
}


class sitesCompositor{

    constructor( pages, compositor ){
        this.divRoot = undefined;
        this.pages = pages;
        this.compositor = compositor
        this.compositor.setParent( this );
        

        this.cl( `sitesCompositor init ... \n\t- pages count: ${this.pages.length}\n\t- compositor: ${this.compositor.name}` );
    }


    cl( m ){
        console.log( 'SitCom    ',m );
    }

    mount( divObj ){ 
        this.divRoot = $(divObj); 
        this.compositor.mount();
    }
}

export { sitesCompositor ,compositorInLine }