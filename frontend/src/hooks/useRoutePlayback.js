import { useEffect } from "react";

export default function useRoutePlayback(
    playing,
    route,
    index,
    setIndex
){

    useEffect(()=>{

        if(!playing) return;

        const timer=setInterval(()=>{

            setIndex(previous=>{

                if(previous>=route.length-1){

                    return previous;

                }

                return previous+1;

            });

        },1000);

        return ()=>clearInterval(timer);

    },[
        playing,
        route,
        setIndex
    ]);

}