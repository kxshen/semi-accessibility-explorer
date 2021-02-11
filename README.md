# SE Michigan Accessibility Explorer 🚌
See https://accessmichigan.mit.edu/. 

Feel free to contact me if you're interested in more specifics. 
Kevin Shen, TPP/MST '21, MIT, kxshen@mit.edu

This technical documentation is meant to be comprehensive, including all of the nitty gritty design choices I've made. For a brief version, see full thesis [here](https://www.dropbox.com/s/yk0w1ifzzprbbqd/shen-tpp-2021.pdf?dl=0). Of course, accepting all help in making this documentation more readable and useful. 

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
[Conveyal Analysis](https://www.conveyal.com/analysis) is a powerful open-source tool used to evaluate accessibility in public transit systems. Building on work by OpenTripPlanner, it runs on R5 for high performance routing. It has features to evaluate accessibility effects of route and schedule changes within minutes, and has recently released a regional analysis function that allows for easy calculation of cumulative opportunities and gravity-based accessibility measures across a region, done in minutes using cloud-based services (with a license). It can be [run locally](https://github.com/conveyal/r5#configuration) on a laptop with minimal configuration (make sure to use a stable release). For running the [front-end](https://github.com/conveyal/analysis-ui) locally (not documented completely):

- From a terminal (I did this all in VS Code), `git clone https://github.com/conveyal/analysis-ui.git`, and then `cd` into it. Make sure you're on the `master` branch with `git checkout`. 
- `npm install` to get all `node_modules`
- Update .env file with new mapbox token (generous free tier on their website) and desired style (https://docs.mapbox.com/api/maps/#mapbox-styles) 
- `npm run-script build`. Change `node` engine variable in `package.json` to local node version. Make sure it's compatible!

The regional analysis tool is essentially a high powered spatial calculator for summing the opportunities reachable by every point in a raster:

<img src="https://render.githubusercontent.com/render/math?math=A_i%20%3D%20%5Csum_j%20Opportunities_j%20f(c_%7Bij%7D)" style="background-color:white;">

where _f(c<sub>ij</sub>)_ is an indicator function which equals one when location _j_ is reachable by location _i_. 

 The competitive accessibility measure used in the tool is comprised of two such computationally heavy operations:

<img src="https://render.githubusercontent.com/render/math?math=A_i%20%3D%20%5Csum_j%20%5Cfrac%7BJobs_j%20f(c_%7Bij%7D)%7D%7B%5Csum_k%20Population_k%20f(c_%7Bjk%7D)%7D%20" style="background-color:white;">

where _k_ is another location variable. 

To calculate this in an incremental and clear way, we first calculate the denominator on the right-hand side for each location in the region's raster _j_, or each job's access to population, with a couple key choices:

- The "competitive population" was conservatively considered to be the total population of people 16 and over measured in the ACS 2014-2018 5-Year Estimates. The low-income "competitive population" was considered to be a similar population consisting of all workers earning less than $3,333/month from LODES 2017 estimates and all unemployed and not-in-labor-force people from ACS 2014-2018 5-Year Estimates. Keep in mind the mixing of the years was assumed to not affect the results much with only small changes on such small time scales. 
    - This competitive population was further assigned car ownership using the percentage of vehicle-owning households in ACS 2018 5-Year Estimates in Table B25044. Each block group's vehicle owning percentage was multiplied by its population to calculate its population traveling by car, and the rest was assumed to be dependent on transit. This is further supported by the fact that car is always faster than transit (buses, no priority) in the region. 
- The reachable time cut-off for "competition" of a population was also conservatively chosen as 60 minutes, using Conveyal's 50th travel time percentile. 
- This calculation was done using both transit (peak service) and car modes. 
    - Peak transit accessibility to population was calculated using the GTFS feed at 5-7pm. Offpeak was assumed to be the middle of the road from 12-2pm. Later, accessibility to jobs was calculated using peak services at 7-9am. The system is largely symmetrical though, so this switching of peak service times likely made a marignal difference. 

From there, four rasters were exported with access to population for the whole/low-income population, and by transit/car. Transit rasters outlined access to transit dependent populations via transit, while car rasters outlined access to vehicle owning populations via car. Transit and car rasters were summed together to create access to whole competitive populations. 

Jobs rasters for low-income jobs and all jobs were retrieved through `lehdr` and converted to .tiff rasters using Conveyal's import tool. Then, these jobs rasters were divided by access to population rasters for a normalized job raster, ready for one more regional accessibility calculation for a final result. 

_Quick note: Conveyal's opportunity datasets import tool intakes .shp (ESRI Shapefiles), .csv's of locations with coordinates and attributes, or Conveyal-specific .grid files. Shapefiles with attributes to polygons are converted to individual points summing to different attributes and randomized within a polygon. Yet, raster exports from Conveyal use .tiff. It's important to be able to navigate these format changes within `sf`, `rgdal`, and other spatial data analysis packages._

## 4. Final Accessibility Analysis using Conveyal Analysis
To import back into Conveyal, the two jobs rasters, for low-income jobs and all jobs, were converted to .csv files with each location on the raster grid and the number of jobs associated with it. From there, the final accessibility results were calculated, with a couple of considerations:

- Conveyal's accessibility tool handles whole numbers in opportunity datasets. Meanwhile, normalized jobs on each point in the raster is on the order of 10<sup>-8</sup>, which eventually will add up to accessibilities on the order of 10<sup>-1</sup>. Meanwhile, Conveyal has a maximum accessibility value of around 10<sup>9</sup> opportunities reached (due to number formats). Therefore, I multiplied the jobs rasters by 10<sup>8</sup> and then divided the final accessibility values by the same number in order for the analysis engine to not exceed its number storage limits while also adding up most small normalized job values on the raster.
- I ran the regional analysis with multiple time travel cutoffs (30, 45, 60 minutes) and multiple travel time percentiles (50th, 75th). I ran transit accessibility calculations with peak and offpeak service types, also ran car accessibility, and ran each of these with low-income jobs and all jobs. This resulted in 3*2*3*2 = **36 accessibility results rasters**.

## 5. Simulating and assigning dots
To simulate the total population age 16 and over in the region at a granular spatial resolution (see `R_scripts/dot_density.Rmd`):

- I first retrieved census block level racial data in the four-county region from the 2010 Dicennial Census (from `tidycensus`), and scaled each block within each block group to ACS 2018 5-year Estimates population levels. 
    - This preserved the within-block-group racial distributions best guessed from the 2010 Census, but also made totals for each race add up to ACS 2018 estimates. 
    - I then outputted a .shp with Black (not Hispanic) and non-Black populations in 2018 for every census _block_, not just block group. 
    - To account for decimals in updated ratios, I randomized which block to assign extra/unaccounted people to random blocks in the block group, without adding people to census blocks with 0 people. 
- I created a dot density map opulation using QGIS3's "Random points inside polygons" function (faster than R's `st_sample()` by a longshot). The number of dots within each block group adds up to the ACS 2018 estimates.
- Using access to population census data, I assigned income and vehicle ownership by block group according to the following steps:
    - First, within each block group, people were in a randomized order.
    - Each block group was assigned a no-vehicle percentage `noveh_perc` and vehicle-owning percentage `car_perc=1-noveh_perc`
    - Assignment constraints:
        - Low-income car riders: `low_car = round(car_perc * low_workforce)`
        - High-income car riders: `high_car = round(car_perc*pop16over - low_car)`
        - Low-income transit riders: `low_trans = low_workforce - low_car`
        - High-income transit riders: `high_trans = pop16over - high_car - low_trans - low_car`
        - These constraints led to some values of `high_trans` less than 0, and so this was recorrected by moving some `high_trans` to `high_car`, while moving some `low_car` to `low_trans`. Though roundabout, this preserved within-block-group no-vehicle rates while adjusting relative vehicle ownership rates between high and low-income groups. This is in lieu of adjusting for lower car commuting rates by low-income groups using external data (0.898 in [the Urban Institute's study](https://www.urban.org/file/accesstoopportunitythroughequitabletransportationtechnicalappendixpdf/download?token=4dxcarpx)). 
- Back in R, randomized dots shapefiles for Black and non-Black populations were bound together into a full dataframe of each person with coordinate locations.
    - Each dot was assigned income group and mode, making sure that each block group had the counts of each group as done in the assignment process in the previous step. 
- Lastly, each dot was assigned accessibility values for each of 36 configurations
    - First `stack` all accessibility results rasters
    - Then use `fast_extract` to extract values at each dot's coordinates from each of the 36 configurations. 
    - Assign mode-specific accessibilities to reduce data output (i.e. for car drivers, assign car accessibilities for peak and non-peak cases. for transit riders, assign transit accessibilities for peak and non-peak cases). Should reduce to 24 accessibility results. 
        - Can also assign low-income folks to low-income accessibilities (competition to low-income jobs amongst low-income people, generally lower), and high-income folks to "all population" accessibilities (i.e. they have freedom to participate in "all" job markets). This would reduce further to 12 results rasters. 
    - Keep track of variable names. See an example at `R_scripts/varnames.csv`. 

## 6. Creating a vector tileset and uploading to Mapbox
First, I converted these dots into a vector tileset format for import into Mapbox using their tool [Tippecanoe](https://github.com/mapbox/tippecanoe). To do so:
- Export the spatial dataframe of dots with attributes to multiple new-line delimited GeoJSON files (for faster parsing). I split them to have 1,000,000 dots, which each took up around 500Mb. Use the driver `GeoJSONSeq` to write new-line delimited `.geojson` files within R's `st_write()`. 
- Install Tippecanoe through the [tutorial documentation](https://github.com/mapbox/tippecanoe#installation). If using Windows, it is possible to install and run with the [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install-win10). This may be easily [enabled](https://www.windowscentral.com/install-windows-subsystem-linux-windows-10) in Windows 10 or can be installed manually.
- Open a terminal in the location with your outputted GeoJSON's (it may be useful to run a test with a small GeoJSON file). I used the command: `tippecanoe -zg -o results.mbtiles --drop-densest-as-needed results1.geojson results2.geojson results3.geojson results4.geojson -P --force -l access`. (Right click to paste in WSL). 
    - `-zg` chooses the max zoom level to reflect precision of the data. Can also be set manually (e.g. `-z10`). 
    - `-o` is output. Output filename comes after. 
    - `--drop-densest-as-needed` is vector tileset formats' method of dropping dots when zoomed out far enough. This helps faster rendering (like in Google Maps, where more details come up with deeper zooms). Other methods of doing this can be specified. 
    - `-P` calls for parallel processing, only able to be done with newline-delimited GeoJSON's. 
    - `--force` overwrites existing results files of the same name
    - `-l` specifies a single layer called `access`. This makes sure to merge all the files into a single layer. 
- `.mbtiles` files can be verified quickly using Mapbox' [mbview](https://github.com/mapbox/mbview). This can be installed easily via npm, a tool installed with Node.js, or can probably also just be cloned from their Github. This viewer allows for quick checks and reconfigurations before uploading to web servers. It requires a Mapbox token, which can be retrieved free on their website. 

Next, I uploaded the results `.mbtiles` file to Mapbox using their [Uploads API](https://docs.mapbox.com/help/tutorials/upload-curl/). 
- WSL already has `cURL` built in, so we will use that for this process. 
- As in the uploads tutorial, install Amazon AWS CLI and set up a separate _secret_ access token for uploads to Mapbox. 
- Then, follow along with their outlined steps, copy-pasting results from the braced variables. 
- Uploads should be able to be seen immediately at https://studio.mapbox.com/tilesets/!
- Note: small tilesets can also be uploaded through the web interface, though this has much more stringent data transfer limits. 

---

## 7. Creating a user interface using React
To create a modern and user-friendly feel to the tool fit for collaboration and minimizing technocratic obscurity, React was chosen, due to its ability to build discrete components, and easily built and abstracted libraries. Though I learned this from scratch, I'll highlight a couple main guideposts here:

- Install [Node.js](https://nodejs.org/en/download/) and therefore also npm. 
- Start a [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) project. 
    - This project used an express/Mongoose/MongoDB database to display transit routes, and was never refactored to get rid of the feature. To get most of the features of the tool though, you only need to create the contents of the `client` folder. 
    - Change the `client/public` folder to change website titles, logos, etc. 
    - Can be tested with a quick `npm start` in a command line terminal within the folder. 

Most of the work goes into the `client/src` folder. 
- In `App.js`, delete everything aside from the framework (the App function, and an empty `return()`). The App function uses JavaScript, while within the return is HTML (and can use JavaScript by using braces { } ). 
- To keep things organized, it is useful to create a `components` folder and create components one by one and link them succinctly in `App.js`. However, this requires you to be careful about which variables are monitored within each component, and the transferring of states between parents and childs (in the HTML sense). I will refactor (clean while preserving functionality) the code in this way to be more organized if it's helpful to someone!
- For good looking layout components, I used [Chakra UI](https://chakra-ui.com/). Other alternatives include Semantic UI or Material UI. Chakra has an emphasis on accessibility (e.g. with easily implemented alt-text) and has an appealing aesthetic and growing user base.

The app consists of three major components, with minor tidbits scattered around as well. 
- First, the slippy map was created using [react-map-gl](https://visgl.github.io/react-map-gl/), a React abstraction of Mapbox GL built by the Uber team. 
    - `Source` and `Layer` components allow for easy map rendering without getting into the Mapbox weeds. Follow tutorials of [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) or react-map-gl to set things up!
    - Using vector tilesets as a dataset (i.e. being able to filter, etc.) is not intended, but was an especially useful step for this project. Doing so requires getting familiar with [Mapbox expressions](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/).
    - Mapbox is a little more intense than [Leaflet](https://react-leaflet.js.org/), but was chosen for its ability to display vector tilesets (lots of data) efficiently). 
- The control panel was done within `App.js`, and uses a `Slide` component in Chakra as a toggleable side panel. `Buttons` that toggle different states (e.g. which race filter or time travel cutoff filter is on) were especially useful. "Layout" components like `Flex` or `Box` help with positioning to your liking. 
- The welcome modal was set simply using the `Modal` component in the components folder. 
- Sizing and positioning of components can be done using HTML syntax or Chakra's [style props](https://chakra-ui.com/docs/features/style-props). 

React takes a while to learn, but results in clean interfaces with a modern feel that helps people use your website!

## 8. Deploying user interface to Heroku
With a user interface nicely running on local host, it's time to deploy to the web. Heroku can host small scale React apps like this for free, with easy options for scaling (if the website has more traffic in the future). 
- Version control using Github/Git is a must.
    - It is best practice to protect things like Mapbox tokens within a secret environment variables file. 
- [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) offers a generous free tier for hosting, all it takes is creation of an account (students can also get a small free upgrade to hobby dynos) and a quick `git push` to a Heroku remote repository.
    - Make sure to configure the app with nodejs and if needed, an [inner buildpack](https://github.com/mars/create-react-app-inner-buildpack). 
- To change the domain name to something easier to remember, Heroku offers a straight forward DNS target to input into domain name hosting services like Namecheap or Bluehost (for prices on the order of $10/year). I used an MIT domain name in consultation with MIT's IT department. 

## 9. Final tidbits
- Transit routes was done by uploading GTFS-derived GeoJSON's for each bus agency to a MongoDB free cloud database. I was planning on doing this for the dots but then realized how inefficient the GeoJSON format was. This was most definitely overkill for just a couple routes. 
- If in Heroku you get a JavaScript heap error message --> change Heroku config variables `NODE_OPTIONS` to `--max_old_space_size=1024` or more. 

---
Much thanks to the open-source community, and for everybody who helped in this journey! In reality, the journey included many more diversions into packages and frameworks that didn't quite suit my needs, etc. Feel free to contact me with specific questions. 