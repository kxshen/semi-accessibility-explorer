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
  SlideFade,
  VStack,
  Heading,
  Text,
  ButtonGroup,
} from "@chakra-ui/react"
import { CloseIcon } from '@chakra-ui/icons'


function App() {
  /* Initialize States */
  const [visible, setVisible] = React.useState(true)
  const [black, setBlack] = React.useState(true)
  const [nonblack, setNonblack] = React.useState(true)
  const [lowinc, setLowinc] = React.useState(true)
  const [highinc, setHighinc] = React.useState(true)
  const [peak, setPeak] = React.useState(true)
  const [cutoff, setCutoff] = React.useState('45')
  const [perc, setPerc] = React.useState('50')

  const { isOpen, onToggle, onClose } = useDisclosure() /* Control panel opening */
  const btnRef = React.useRef() /* Use reference to have specific button for Drawer to listen to? I think? */

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
          className='map'>
        </Map>

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
            <Text mt={4}>Currently under construction and looking for your feedback! <br/> <i> Last updated: January 4, 2021</i></Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" m="5px">
            <Heading fontSize="xl">Data Controls</Heading>
            <p><i>Race</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setBlack(true); setNonblack(false)}} colorScheme="blue" bg={black && !nonblack ? "blue.500" : "gray.400"} >Black</Button>
              <Button onClick={() => { setBlack(false); setNonblack(true)}} colorScheme="blue" bg={!black &&  nonblack ? "blue.500" : "gray.400"}>Nonblack</Button>
              <Button onClick={() => { setBlack(true); setNonblack(true)}} colorScheme="blue" bg={black && nonblack ? "blue.500" : "gray.400"}>All</Button>
            </ButtonGroup>
            <br/>
            <p><i>Income Group</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setLowinc(true); setHighinc(false)}} colorScheme="blue" bg={lowinc && !highinc ? "blue.500" : "gray.400"} >Low</Button>
              <Button onClick={() => { setLowinc(false); setHighinc(true)}} colorScheme="blue" bg={!lowinc && highinc ? "blue.500" : "gray.400"}>High</Button>
              <Button onClick={() => { setLowinc(true); setHighinc(true)}} colorScheme="blue" bg={lowinc && highinc ? "blue.500" : "gray.400"}>All</Button>
            </ButtonGroup>
            <br/> <br/>
            <Heading fontSize="xl">Job Accessibility Settings</Heading>
            <p><i>Time Travel Cutoff</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setCutoff('30')}} colorScheme="blue" bg={cutoff == '30' ? "blue.500" : "gray.400"} >30 min</Button>
              <Button onClick={() => { setCutoff('45')}} colorScheme="blue" bg={cutoff == '45' ? "blue.500" : "gray.400"}>45 min</Button>
              <Button onClick={() => { setCutoff('60')}} colorScheme="blue" bg={cutoff == '60' ? "blue.500" : "gray.400"}>60 min</Button>
            </ButtonGroup>
            <br/>
            <p><i>Transit Service Type (subtle)</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setPeak(false)}} colorScheme="blue" bg={!peak ? "blue.500" : "gray.400"} >Off-Peak</Button>
              <Button onClick={() => { setPeak(true)}} colorScheme="blue" bg={peak ? "blue.500" : "gray.400"}>Peak</Button>
            </ButtonGroup>
            <br/>
            <p><i>Travel Time Percentile (subtle)</i></p>
            <ButtonGroup size="sm" isAttached variant="solid">
              <Button onClick={() => { setPerc('50')}} colorScheme="blue" bg={perc == '50' ? "blue.500" : "gray.400"} >50th</Button>
              <Button onClick={() => { setPerc('75')}} colorScheme="blue" bg={perc == '75' ? "blue.500" : "gray.400"}>75th</Button>
            </ButtonGroup>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" m="5px">
            <Heading fontSize="xl">What is being shown here?</Heading>
            <p>
              This map shows access to jobs in Southeast Michigan including Wayne, Washtenaw, Macomb, and Oakland Counties. 
              Each dot roughly represents one person and many of the low accessibility dots represent people who do not have access to a car and must rely on transit or other means of getting around. 
              It hopes to make clear that the 21 mile man is not a unique story-- many residents of the region face large barriers in getting to work. 
            </p>
            <br/>
            <Heading fontSize="xl">Why are you showing this?</Heading>
            <p> 
              This tool aims to help showcase well-known anecdotes of inaccessibility in a new light, to see what new insights you might gain from doing so. 
              It aims to amplify your feedback and stories in pursuit of a more just and mobile future for all. ✊
            </p>
          </Box>

          {/* Final footer */}
          <Text p={5} shadow="md" borderWidth="1px" m="5px" bg="purple.700" color="white">
            Made with <span role="img" aria-label="love">💚</span> by 
            <a href="http://workofthefuture.mit.edu" target="_blank" rel="noopener noreferrer"> MIT WotF </a> 
            [link to thesis and Github repo]
          </Text>
        </VStack>
      </Slide>
      </Flex>

    </div>
  );
}

//Export App to index.js
export default App;
