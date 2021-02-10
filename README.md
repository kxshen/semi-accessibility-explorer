# SE Michigan Accessibility Explorer 🚌
See https://accessmichigan.mit.edu/. 

Feel free to contact me if you're interested in more specifics. 
Kevin Shen, TPP/MST '21, MIT, kxshen@mit.edu

This technical documentation is meant to be comprehensive, including all of the nitty gritty design choices I've made. For a brief version, see full thesis [here](https://www.dropbox.com/s/yk0w1ifzzprbbqd/shen-tpp-2021.pdf?dl=0). 

## 1. Gathering Transportation Network Data
First, I chose a bounded region of study to reduce computation time. I chose the four-county region in SE Michigan (Wayne, Oakland, Macomb, Washtenaw) due to its stakes in the RTA. There are other definitions of "SE Michigan" (e.g. SEMCOG defines a seven-county region), but I was more interested in the dynamics immediately surrounding a long political history in Detroit. 

If results for the residents of the four-county region are desired, we are actually interested in a number of reachable destinations surrounding this region. A bubble encompassing major job centers of Flint and Lansing was chosen as this broader area of study (-85.028,41.5885,-82.2841,43.5105). This was chosen conservatively by hand through this [bounding box tool](https://boundingbox.klokantech.com/). 

The first steps largely follow the basic [OpenTripPlanner Tutorial](https://docs.opentripplanner.org/en/latest/Basic-Tutorial/). For the transit network, major GTFS feeds in the region (chosen as SMART, DDOT, and AAATA) were downloaded from [TransitLand](transit.land) and by emailing the providers directly for updated feeds (regrettably, not all providers make up-to-date feeds publicly available). For the overall roads network, an OpenStreetMaps Michigan .pbf file was downloaded at [Geofabrik](http://download.geofabrik.de/), and was then clipped to the bounding box using [osmconvert](https://wiki.openstreetmap.org/wiki/Osmconvert#Download). Download `osmconvert.exe` and drag it to the same folder as the larger .pbf file. Open a command line in the folder and run: 

`osmconvert michigan.osm.pbf -b=-85.028,41.5885,-82.2841,43.5105 --complete-ways -o=output.pbf`

Save the GTFS feeds and OSM files in a easily found folder. 

## 2. Destination data
This thesis relies on US Census data (LODES and ACS) for population and job opportunities. Though these do come with [limitations](https://urban-institute.medium.com/open-accessible-data-on-jobs-and-workers-tract-level-lodes-data-945fcac9e280), they are well standardized and widely available, in contrast to privately provided data. 

Due to widespread use of LODES and ACS, people have created R packages to make data retrieval easier and neater. `lehdr` for LODES and `tidycensus` for ACS all just require a Census data API key and download chosen data into R spatial dataframes. Spatial data manipulation was done using `tidyverse` and `sf` packages. See R script at `R_scripts/data_retrieval.Rmd` for more details on the process. 

At the end, write out .shp files with jobs and population data for input into Conveyal Analysis

## 3. Jobs Normalization using Conveyal Analysis
[Conveyal Analysis](https://www.conveyal.com/analysis) is a powerful open-source tool used to evaluate accessibility in public transit systems. Building on work by OpenTripPlanner, it runs on R5 for high performance routing. It has features to evaluate accessibility effects of route and schedule changes within minutes, and has recently released a regional analysis function that allows for easy calculation of cumulative opportunities and gravity-based accessibility measures across a region, done in minutes using cloud-based services (with a license). It can be [run locally](https://github.com/conveyal/r5#configuration) on a laptop with minimal configuration. For running the [front-end](https://github.com/conveyal/analysis-ui) locally (not documented completely):

- From a terminal (I did this all in VS Code), `git clone https://github.com/conveyal/analysis-ui.git`, and then `cd` into it. Make sure you're on the `master` branch with `git checkout`. 
- `npm install` to get all `node_modules`
- Update .env file with new mapbox token (generous free tier on their website) and desired style (https://docs.mapbox.com/api/maps/#mapbox-styles) 
- `npm run-script build`. Change `node` engine variable in `package.json` to local node version. Make sure it's compatible!

The regional analysis tool is essentially a high powered spatial calculator for summing the opportunities reachable by every point in a raster. The competitive accessibility measure is made up of two of these operations, 

<img src="https://render.githubusercontent.com/render/math?math=e^{i \pi} = -1">


... testing, to be continued. 