import * as React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Heading,
    Box,
    Link,
  } from "@chakra-ui/react"

function WelcomeModal(props) {
    return (
        <Modal isOpen={props.open} onClose={() => props.toggle(false)} size={"4xl"} isCentered scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><b>Welcome!</b></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={5} shadow="md" borderWidth="1px" m="5px" mt="0px">
              Getting to where you need to go in SE Michigan can be difficult, and the pandemic has made it even harder. Perhaps you have an excruciating commute, or are familiar with stories of neighbors getting by without a car. 
              This can make it harder to go the grocery store, doctor's offices, schools, jobs, loved ones, or anything else that's helpful for just living a life in this connected world. 
              <br/> <br/>
              Transportation wonks call this ability to "get where you need to go" <b>accessibility</b>, and have written stacks of academic books and papers on the topic. 
              But in trying to describe how easy it is for <i>you</i> to get around, they rarely make their work easily interpretable or incorporate <i>your</i> voices. 
            </Box>
            <Box p={5} shadow="md" borderWidth="1px" m="5px">
              <Heading fontSize="xl">So, why did you make this?</Heading>
              <p> 
                This tool aims to shine a new light on well-known stories of inaccessibility, such as the <Link color="teal.400" href="https://www.freep.com/story/news/local/michigan/oakland/2015/01/31/detroit-commuting-troy-rochester-hills-smart-ddot-ubs-banker-woodward-buses-transit/22660785/">
                  "21-Mile Man"</Link> James Robertson. Hopefully you might gain some new insights or you might be more interested in how together we can make sense of the region's transportation system. 
                This is only a first version of the tool, and its future depends on your <Link color="teal.400" href="https://forms.gle/5FqtvY9xLTux55kv6">
                feedback</Link>. It hopes to be able to amplify your voices and stories in pursuit of a more just and mobile future for all. ✊
              </p>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => props.toggle(false)}>
              Start 🚌
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   );
}

export default WelcomeModal;