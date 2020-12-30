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
} from "@chakra-ui/react"



function App() {
  const [visible, setVisible] = React.useState(true)
  const [race, setRace] = React.useState('black')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef() /* Use reference to have specific button for Drawer to listen to? I think? */

  return (
    <div>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen} className='header'>
          Controls
      </Button>
      <Map race = {race} className='map'>
      </Map>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        closeOnOverlayClick={false}
        useInert={false}
        blockScrollOnMount={false}
        scrollBehavior="inside"
      >
        {/* Clear color overlay is #00000000 */}
        {/* <DrawerOverlay bg = "#00000000" zIndex='500'> */}
          <DrawerContent zIndex='999'>
            <DrawerCloseButton />
            <DrawerHeader>Accessibility Explorer Controls!</DrawerHeader>

            <DrawerBody>
              <Button onClick={() => setRace('nonblack')} colorScheme="blue">Nonblack</Button>
              <Button onClick={() => setRace('black')} colorScheme="blue">Black</Button>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        {/* </DrawerOverlay> */}
      </Drawer>
      
      {/* <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        closeOnOverlayClick={false}
        useInert={false}
        blockScrollOnMount={false}
        scrollBehavior="inside"
      > */}
        {/* Clear color overlay is #00000000 */}
        {/* <DrawerOverlay bg = "#00000000" zIndex='500'>
          <DrawerContent zIndex='999'>
            <DrawerCloseButton />
            <DrawerHeader>Accessibility Explorer Controls!</DrawerHeader>

            <DrawerBody>
              <Button onClick={() => setRace('nonblack')} colorScheme="blue">Nonblack</Button>
              <Button onClick={() => setRace('black')} colorScheme="blue">Black</Button>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer> */}
              {/* <Slide direction="left" in={isOpen} style={{height:'100vh', width: '300px', zIndex: 10 }}>
        <Box
          p="40px"
          color="white"
          mt="0"
          bg="teal.500"
          rounded="md"
          shadow="md"
          h="100vh"
        >
hihihihihi        </Box>
      </Slide> */}
    </div>
  );
}

//Export App to index.js
export default App;
