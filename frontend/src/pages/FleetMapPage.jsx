import { useEffect, useState } from "react";

import FleetMap from "../components/map/FleetMap";
import FleetStats from "../components/map/FleetStats";
import FleetSearch from "../components/map/FleetSearch";
import FleetFilter from "../components/map/FleetFilter";

import PlaybackControls from "../components/map/PlaybackControls";
import RouteStatistics from "../components/map/RouteStatistics";

import mapService from "../services/mapService";
import routeService from "../services/routeService";

import useRoutePlayback from "../hooks/useRoutePlayback";

export default function FleetMapPage() {

    const [trucks, setTrucks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("All");

    const [selectedTruck, setSelectedTruck] = useState(null);

    const [route, setRoute] = useState([]);

    const [playing, setPlaying] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {

        loadTruckLocations();

    }, []);

    async function loadTruckLocations() {

        try {

            const data = await mapService.getTruckLocations();

            setTrucks(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    async function handleTruckSelect(truck) {

        setSelectedTruck(truck);

        try {

            const history = await routeService.getRoute(truck.id);

            setRoute(history);

            setCurrentIndex(0);

        }

        catch (error) {

            console.error(error);

        }

    }

    useRoutePlayback(

        playing,

        route,

        currentIndex,

        setCurrentIndex

    );

    const filteredTrucks = trucks.filter((truck) => {

        const matchesSearch =

            truck.truck_no.toLowerCase().includes(search.toLowerCase()) ||

            truck.driver.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =

            filter === "All" ||

            truck.status === filter;

        return matchesSearch && matchesFilter;

    });

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="fleet-page">

            <h1>Fleet Live Map</h1>

            <FleetStats trucks={trucks} />

            <FleetSearch

                search={search}

                setSearch={setSearch}

            />

            <FleetFilter

                filter={filter}

                setFilter={setFilter}

            />

            <FleetMap

                trucks={filteredTrucks}

                selectedTruck={selectedTruck}

                setSelectedTruck={handleTruckSelect}

                route={route}

                currentIndex={currentIndex}

            />

            {

                route.length > 0 &&

                <>

                    <PlaybackControls

                        playing={playing}

                        setPlaying={setPlaying}

                        currentIndex={currentIndex}

                        setCurrentIndex={setCurrentIndex}

                        maxIndex={route.length - 1}

                    />

                    <RouteStatistics

                        route={route}

                    />

                </>

            }

        </div>

    );

}