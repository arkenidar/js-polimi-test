// https://www.dropbox.com/s/4xg7h9qacuwqf70/polimi-test.js
// https://www.dropbox.com/s/4ou923pc9aonkov/presentazione.pdf
/*
entita_monitorate=["Dario", "Elena", "Luigi"]
relazioni_esempio={
    "amico_di":[
        // dario amico di luigi
        ["Dario","Luigi"],
        // carlo amico di luigi
        ["Carlo","Luigi"],
    ],
    "segue":[
        // dario segue elena
        ["Dario","Elena"],
        // elena segue dario
        ["Elena","Dario"],
        // dario segue luigi
        ["Dario","Luigi"],
    ],
    "coetaneo_di":[
        // luigi coetaneo di elena
        ["Luigi","Elena"]
    ],
}
*/

// virgoletta
function quotes(text){
    return '"'+text+'"'
}

// comando "report"
function report(entita_relazioni){
    console.log("report")
    if(Object.keys(entita_relazioni.relazioni).length==0){
        console.log('none')
        return
    }

    var output=''
    var elenco=[]
    var relazioni_ordinate=Object.keys(entita_relazioni.relazioni).sort()
    for(relazione of relazioni_ordinate){
        output+=quotes(relazione)+' '
        var massimo=-1

        for(var ricevitore of Object.keys(entita_relazioni.entranti[relazione])){
            massimo=Math.max(massimo,entita_relazioni.entranti[relazione][ricevitore].length)
        }


        var ricevitori=[]
        for(var ricevitore of Object.keys(entita_relazioni.entranti[relazione])){
            if(entita_relazioni.entranti[relazione][ricevitore].length==massimo)
                ricevitori.push(quotes(ricevitore))
        }
        output+=ricevitori.sort().join(' ')
        output+=' '+massimo+';'
        elenco.push(output)
        output=''
    }
    console.log(elenco.join(' '))
}

// costruisce "entranti" una struttura dati derivata dalle relazioni
function entranti_da_relazioni(relazioni){
    var entranti={}
    for(relazione in relazioni){
        relazione_corrente=relazioni[relazione]
        for(collegamento of relazione_corrente){
            var collegamento_da=collegamento[0]
            var collegamento_a=collegamento[1]
            if(entranti[relazione]==undefined)
                entranti[relazione]={}
            if(entranti[relazione][collegamento_a]==undefined)
                entranti[relazione][collegamento_a]=[]
            if(!(collegamento_da in entranti[relazione][collegamento_a]))
                entranti[relazione][collegamento_a].push(collegamento_da)
        }

    }
    return entranti
}

// aggiunge un'entità all'elenco delle entità monitorate
// comando "addent"
function addent(id_ent,entita_monitorate){
    console.log("addent "+quotes(id_ent))
    if(!(id_ent in entita_monitorate))
        entita_monitorate.push(id_ent)
}

// cancella una relazione
// richiede entranti_da_relazioni() addent()
// comando "addrel"
function addrel(id_orig,id_dest,id_rel,entita_relazioni){
    console.log('addrel',quotes(id_orig),quotes(id_dest),quotes(id_rel))
    // aggiungi entità se mancano
    //if(entita_relazioni.entita_monitorate.indexOf(id_orig)==-1)addent(id_orig,entita_relazioni.entita_monitorate)
    //if(entita_relazioni.entita_monitorate.indexOf(id_dest)==-1)addent(id_dest,entita_relazioni.entita_monitorate)
    // crea il tipo di relazioni se manca
    if(!(id_rel in entita_relazioni.relazioni))
        entita_relazioni.relazioni[id_rel]=[]
    // il collegamento è unico
    // se c'è già non aggiungerne una copia
    for(relazione of entita_relazioni.relazioni[id_rel])
        if(relazione[0]==id_orig && relazione[1]==id_dest)
            return
    // aggiungi collegamento
    entita_relazioni.relazioni[id_rel].push([id_orig,id_dest])
    // mantieni aggiornato "entranti"
    entita_relazioni.entranti=entranti_da_relazioni(entita_relazioni.relazioni)
}

// cancella una relazione
// richiede entranti_da_relazioni()
// comando "delrel"
function delrel(id_orig,id_dest,id_rel,entita_relazioni){
    console.log('delrel',quotes(id_orig),quotes(id_dest),quotes(id_rel))
    // esce se il tipo di relazione manca
    //if(!(id_rel in entita_relazioni.relazioni))return
    // cerca e cancella la relazione
    for(relazione of entita_relazioni.relazioni[id_rel])
        if(relazione[0]==id_orig && relazione[1]==id_dest){
            // trovato
            ///delete relazione
            // cancella relazione
            entita_relazioni.relazioni[id_rel]=entita_relazioni.relazioni[id_rel].filter(r=>r!=relazione)
            // cancella tipo di relazione se non ci sono più relazioni di quel tipo
            if(entita_relazioni.relazioni[id_rel].length==0)
                delete entita_relazioni.relazioni[id_rel]
            // esce dal loop
            // questo perchè ogni relazione è unica (non sono possibili copie)
            // e cancellandola non ce ne sono copie da cancellare ulteriormente
            break
        }
    // mantieni aggiornato "entranti"
    entita_relazioni.entranti=entranti_da_relazioni(entita_relazioni.relazioni)
}

// cancella una entità
// richiede entranti_da_relazioni()
// comando "delent"
function delent(ident,entita_relazioni){
    console.log('delent',quotes(ident))
    // esce se manca l'entità
    if(entita_relazioni.entita_monitorate.indexOf(ident)==-1)
        return
    // cancella l'entità

    ///delete entita_relazioni.entita_monitorate[ident]
    entita_relazioni.entita_monitorate=entita_relazioni.entita_monitorate.filter(e=>e!=ident)

    // cerca e cancella le relazioni usanti l'entità eliminata
    for(id_rel in entita_relazioni.relazioni)
    for(relazione of entita_relazioni.relazioni[id_rel])
        if(relazione[0]==ident || relazione[1]==ident){
            // trovato
            ///delete relazioni[id_rel][relazione]
            entita_relazioni.relazioni[id_rel]=entita_relazioni.relazioni[id_rel].filter(e=>e!=relazione)
        }
    // mantieni aggiornato "entranti"
    entita_relazioni.entranti=entranti_da_relazioni(entita_relazioni.relazioni)
}

// punto d'ingresso del programma, funzione principale
function main(){

    var entita_relazioni={
        // entità in che possono essere in relazione
        entita_monitorate:[],
        // creazione hashmap relazioni "da x a y"
        relazioni:{},
        // creazione hashmap relazioni entranti
        entranti:{},
    }

    addent("alice",entita_relazioni.entita_monitorate)
    addent("bruno",entita_relazioni.entita_monitorate)
    addent("carlo",entita_relazioni.entita_monitorate)
    addent("dario",entita_relazioni.entita_monitorate)
    report(entita_relazioni)
    addrel("carlo","bruno","amico_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 1;
    addrel("carlo","alice","amico_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "alice" "bruno" 1;
    addrel("alice","bruno","amico_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 2;
    addrel("bruno","dario","compagno_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 2; "compagno_di" "dario" 1;
    delrel("carlo","alice","amico_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 2; "compagno_di" "dario" 1;
    addrel("carlo","alice","compagno_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 2; "compagno_di" "alice" "dario" 1;
    addrel("carlo","bruno","compagno_di",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 2; "compagno_di" "alice" "bruno" "dario" 1;
    delent("alice",entita_relazioni)
    report(entita_relazioni) // "amico_di" "bruno" 1; "compagno_di" "bruno" "dario" 1;
    //end

}

main() // avvia il programma
