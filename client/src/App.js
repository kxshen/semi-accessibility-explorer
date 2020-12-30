// Use App.js as integrating components
import * as React from 'react';
import './App.css';
import Map from './components/Map';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
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
  const [visible, setVisible] = React.useState(true)
  const [black, setBlack] = React.useState(true)
  const [nonblack, setNonblack] = React.useState(true)
  const [lowinc, setLowinc] = React.useState(true)
  const [highinc, setHighinc] = React.useState(true)
  const { isOpen, onToggle, onClose } = useDisclosure()
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
              <Heading fontSize={28}>SE Michigan Accessibility Explorer</Heading>
              <IconButton aria-label="Close Control Panel" icon={<CloseIcon />} onClick={onToggle} color="black"/>
            </Flex>
            <Text mt={4}>[this is an accessibility map, narrative overview]</Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" m="5px">
            <Heading fontSize="xl">Data Controls</Heading>
            <br/>
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

          </Box>

          {/* FInal footer */}
          <Text p={5} shadow="md" borderWidth="1px" m="5px" bg="purple.700" color="white">Made with <span role="img" aria-label="love">💚</span> by <a href="http://workofthefuture.mit.edu" target="_blank" rel="noopener noreferrer">MIT WotF [insert other informational text, link to thesis, Github repo]</a></Text>
        </VStack>
      </Slide>
      </Flex>

    </div>
  );
}

//Export App to index.js
export default App;
