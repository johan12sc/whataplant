
import React from 'react'
import {WebView} from 'react-native-webview'

const PowerBiView = () =>{

    const Lien = j ;// le lien pour la visualisation de powerBI

    return (
        <webview
        source={{ uri: Lien }}
        style={{flex:1}}
        javaScriptEnable={true}
        domstorageEnable={true}
        
    
        />
    );
};

     










