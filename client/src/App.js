// Use App.js as integrating components
import * as React from 'react';
import './App.css';
import Map from './components/Map';
import {
  useDisclosure,
  Button,
  Box,
  Flex,
  Slide,
  IconButton,
  VStack,
  Heading,
  Text,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Image,
  Link,
  UnorderedList,
  ListItem
} from "@chakra-ui/react"
import { CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import Legend from "./components/legend.png"
import WelcomeModal from './components/welcome'

function App() {
  /* Initialize States */
  const [black, setBlack] = React.useState(true)
  const [nonblack, setNonblack] = React.useState(true)
  const [lowinc, setLowinc] = React.useState(true)
  const [highinc, setHighinc] = React.useState(true)
  const [peak, setPeak] = React.useState(true)
  const [cutoff, setCutoff] = React.useState('45')
  const [perc, setPerc] = React.useState('50')
  const [basemap, setBasemap] = React.useState("mapbox://styles/mapbox/dark-v10")
  const [transitvisible, setTransitvisible] = React.useState(false)
  const [trans, setTrans] = React.useState(true)
  const [car, setCar] = React.useState(true)


  const { isOpen, onToggle } = useDisclosure() /* Control panel opening */
  const btnRef = React.useRef() /* Use reference to have specific button for Drawer to listen to? I think? */
  const [modal, setModal] = React.useState(true)

  React.useEffect(() => {
    onToggle()
  }, []);

  return (
    <div>
      <Flex height="100vh" width="100vw">
        <div style={{position: 'absolute', left: '5px', top: '5px', zIndex: '100'}}>
          <Button ref={btnRef} colorScheme="teal" onClick={onToggle}>
              Controls
          </Button>           
        </div>
        <Map 
          black = {black} 
          nonblack = {nonblack}
          lowinc = {lowinc}
          highinc = {highinc}
          peak = {peak}
          cutoff = {cutoff}
          perc = {perc}
          basemap = {basemap}
          transitvisible = {transitvisible}
          trans = {trans}
          car = {car}
          className='map'>
        </Map>

        <WelcomeModal
          open = {modal}
          toggle = {setModal}></WelcomeModal>

      <Slide direction="left" in={isOpen} style={{height:'100vh', width: '300px', zIndex: 100 }}>
        <VStack            
          color="black"
          bg="white"
          rounded="md"
          h="100vh"
          w="300px"
          overflowY="scroll">
          <Box p={5} shadow="md" borderWidth="1px" m="5px" bg="purple.700" color="white">
            <Flex>
              <Heading fontSize={28}>SE Michigan Accessibility Explorer <span role="img" aria-label="bus">🚌</span> </Heading>
              <IconButton aria-label="Close Control Panel" icon={<CloseIcon />} onClick={onToggle} color="black"/>
            </Flex>
            <Button mt={2} colorScheme="blue" onClick={() => setModal(true)}>
              Open introduction
            </Button>
            <Text mt={0}>
            <Link color="teal.300" href="https://forms.gle/5FqtvY9xLTux55kv6">
               Link to feedback form
            </Link>
            <br/>
            <i> Last updated: February 9, 2021</i></Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" m="5px">
            <Heading fontSize="xl">Data Controls</Heading>
            <p><i>Race</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setBlack(true); setNonblack(false)}} colorScheme="blue" bg={black && !nonblack ? "blue.500" : "gray.400"} >Black</Button>
              <Button onClick={() => { setBlack(false); setNonblack(true)}} colorScheme="blue" bg={!black &&  nonblack ? "blue.500" : "gray.400"}>Non-Black</Button>
              <Button onClick={() => { setBlack(true); setNonblack(true)}} colorScheme="blue" bg={black && nonblack ? "blue.500" : "gray.400"}>All</Button>
            </ButtonGroup>
            <br/>
            <p><i>Income Group</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setLowinc(true); setHighinc(false)}} colorScheme="blue" bg={lowinc && !highinc ? "blue.500" : "gray.400"} >Low</Button>
              <Button onClick={() => { setLowinc(false); setHighinc(true)}} colorScheme="blue" bg={!lowinc && highinc ? "blue.500" : "gray.400"}>High</Button>
              <Button onClick={() => { setLowinc(true); setHighinc(true)}} colorScheme="blue" bg={lowinc && highinc ? "blue.500" : "gray.400"}>All</Button>
            </ButtonGroup>
            <br/>
            <p><i>Car ownership</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setTrans(true); setCar(false)}} colorScheme="blue" bg={trans && !car ? "blue.500" : "gray.400"} >No car</Button>
              <Button onClick={() => { setTrans(false); setCar(true)}} colorScheme="blue" bg={!trans && car ? "blue.500" : "gray.400"}>Car</Button>
              <Button onClick={() => { setTrans(true); setCar(true)}} colorScheme="blue" bg={trans && car ? "blue.500" : "gray.400"}>All</Button>
            </ButtonGroup>
            <br/>
            <p><i>Toggle all data (explore map)</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setLowinc(false); setHighinc(false); setBlack(false); setNonblack(false)}} colorScheme="blue" bg={!lowinc && !highinc ? "blue.500" : "gray.400"} >Off</Button>
              <Button onClick={() => { setLowinc(true); setHighinc(true); setBlack(true); setNonblack(true)}} colorScheme="blue" bg={lowinc || highinc ? "blue.500" : "gray.400"}>On</Button>
            </ButtonGroup>
            <br/>
            <p><i>Travel Time Cutoff</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setCutoff('30')}} colorScheme="blue" bg={cutoff == '30' ? "blue.500" : "gray.400"} >30 min</Button>
              <Button onClick={() => { setCutoff('45')}} colorScheme="blue" bg={cutoff == '45' ? "blue.500" : "gray.400"}>45 min</Button>
              <Button onClick={() => { setCutoff('60')}} colorScheme="blue" bg={cutoff == '60' ? "blue.500" : "gray.400"}>60 min</Button>
            </ButtonGroup>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" m="5px">
            <Heading fontSize="xl">What is being shown here?</Heading>
            <p>
              This map shows how difficult it is to get to jobs for people in Wayne, Washtenaw, Macomb, and Oakland Counties, MI. 
              <br/> <br/>
              Each dot roughly represents one person aged 16 and over. Don't fret, locations are simulated and not exact.
              <br/> <br/>
              People with higher job accessibility (<font color="#0571b0">bluer</font> dots) can reach many jobs easily, perhaps they live close to many jobs or have a car. 
              <br/> <br/>
              People with lower job accessibility (<font color="ca0020">redder</font> dots) can reach fewer jobs with more difficulty. Perhaps they live further from jobs or rely on sparse transit service. 
              <br/> <br/>
              More information about the value of the accessibility index can be found in the technical appendix (link incoming). 
            </p>
            <br/>
            <p> Please don't forget to fill out the <Link color="teal.400" href="https://forms.gle/5FqtvY9xLTux55kv6">
              feedback form
            </Link>!
            </p>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" m="5px">
            <Heading fontSize="xl">Potential future features</Heading>
            <i>From feedback thus far. Always welcoming more ideas!</i>
            <UnorderedList>
              <ListItem>Clickable pins with your own transportation stories</ListItem>
              <ListItem>Search bar for addresses</ListItem>
              <ListItem>Walkthrough page explaining different features of the tool</ListItem>
            </UnorderedList>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px"  m="5px">
           <Heading fontSize="xl">Calculation Settings</Heading>
            <p><i>Transit Service Type (subtle)</i></p>
              <ButtonGroup size="sm" isAttached variant="solid">
                <Button onClick={() => { setPeak(false)}} colorScheme="blue" bg={!peak ? "blue.500" : "gray.400"} >Off-Peak</Button>
                <Button onClick={() => { setPeak(true)}} colorScheme="blue" bg={peak ? "blue.500" : "gray.400"}>Peak</Button>
              </ButtonGroup>
              <br/>
              <p><i>Travel Time Percentile (<Link color="teal.500" href="https://docs.conveyal.com/analysis/methodology#time-percentile">
                info
              </Link>)</i></p>
              <ButtonGroup size="sm" isAttached variant="solid">
                <Button onClick={() => { setPerc('50')}} colorScheme="blue" bg={perc == '50' ? "blue.500" : "gray.400"} >50th</Button>
                <Button onClick={() => { setPerc('75')}} colorScheme="blue" bg={perc == '75' ? "blue.500" : "gray.400"}>75th</Button>
              </ButtonGroup>
          </Box>

          {/* Final footer */}
          <Text p={5} shadow="md" borderWidth="1px" m="5px" bg="purple.700" color="white">
            Made with <span role="img" aria-label="love">💚</span> by <Link color="teal.300" href="http://workofthefuture.mit.edu">MIT WotF</Link> 
            <br/>
            <Link color="teal.300" href="https://www.dropbox.com/s/yk0w1ifzzprbbqd/shen-tpp-2021.pdf?dl=0">
                Thesis
              </Link>
            <br/>
            <Link color="teal.300" href="https://github.com/kxshen/semi-accessibility-explorer">
                Github repository
              </Link>        
            <br/>
            Contact: <i>kxshen@mit.edu</i>
          </Text>
        </VStack>
      </Slide>

      {/* Bottom right map controls https://docs.mapbox.com/api/maps/styles/#mapbox-styles*/}
      <div className="legend">
      <Box bg="white" p={5} 
            shadow="md" 
            borderWidth="1px" 
            m="5px"           
            rounded="md"
            >
              <Heading fontSize="l">Job Accessibility</Heading>
              <Image src={Legend} alt="legend"/>
              <Text fontSize="xs"><i>approx one dot per person</i></Text>
            </Box>
      </div>
        <div className="footer">
            <Menu            
            p={5} 
            shadow="md" 
            borderWidth="1px" 
            m="5px"
            rounded="md">
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Basemap
                </MenuButton>
                <MenuList>
                  <MenuOptionGroup value={basemap} type="radio" onChange={setBasemap}>
                    <MenuItemOption 
                    value="mapbox://styles/mapbox/dark-v10"
                    isChecked={basemap == "mapbox://styles/mapbox/dark-v10"}>Dark</MenuItemOption>
                    <MenuItemOption 
                    value="mapbox://styles/kshen1110/ckkej36gz11if17o5y3xe5017"
                    isChecked={basemap == "mapbox://styles/kshen1110/ckkej36gz11if17o5y3xe5017"}>Dark+Interstates</MenuItemOption>
                    <MenuItemOption 
                    value="mapbox://styles/mapbox/light-v10"
                    isChecked={basemap == "mapbox://styles/mapbox/light-v10"}>Light</MenuItemOption>
                  <MenuItemOption 
                    value="mapbox://styles/mapbox/streets-v11"
                    isChecked={basemap == "mapbox://styles/mapbox/streets-v11"}>Streets</MenuItemOption>
                  <MenuItemOption 
                    value="mapbox://styles/mapbox/satellite-streets-v11"
                    isChecked={basemap == "mapbox://styles/mapbox/satellite-streets-v11"}>Satellite</MenuItemOption>
                  </MenuOptionGroup>
                  <MenuDivider />
                  <MenuOptionGroup type="checkbox" onChange={(e) => setTransitvisible(!transitvisible)}>
                    <MenuItemOption isChecked={transitvisible}>Show bus routes</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
            </Menu>          
            </div>
      </Flex>

    </div>
  );
}

//Export App to index.js
export default App;
