'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Avatar, AppBar, Toolbar, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Add, Remove, Delete, Inventory, Menu } from '@mui/icons-material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { signInWithGoogle, signOutUser, useAuth } from '@/auth'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const user = useAuth();
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    if (user) {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() })
      })
      setInventory(inventoryList)
    } else {
      setInventory([])
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [user])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: '#e0f7fa', color: '#000000' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          {user ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={user.photoURL} alt={user.displayName} />
              <Typography variant="h6">{user.displayName}</Typography>
              <Button variant="contained" onClick={signOutUser} sx={{ backgroundColor: '#d32f2f', color: '#ffffff' }}>
                Sign out
              </Button>
            </Box>
          ) : (
            <Button variant="contained" onClick={signInWithGoogle} sx={{ backgroundColor: '#00796b', color: '#ffffff' }}>
              Sign in with Google
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This is to offset the content below the fixed AppBar */} 
      {user ? (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction={'row'} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName)
                    setItemName('')
                    handleClose()
                  }}
                  startIcon={<Add />}
                  sx={{ color: '#00796b', borderColor: '#00796b' }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Button variant="contained" onClick={handleOpen} startIcon={<Add />} sx={{ backgroundColor: '#00796b', color: '#ffffff' }}>
            Add New Item
          </Button>
          <Box border={'1px solid #333'} borderRadius={2} p={2} bgcolor={'#e0f7fa'}>
            <Box
              width="800px"
              height="100px"
              bgcolor={'#00796b'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={2}
            >
              <Typography variant={'h2'} color={'#ffffff'} textAlign={'center'} sx={{ fontFamily: 'Georgia, serif' }}>
                Inventory Items
              </Typography>
            </Box>
            <Stack width="800px" height="300px" spacing={2} overflow={'auto'} mt={2}>
              {inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  bgcolor={'#ffffff'}
                  paddingX={5}
                  borderRadius={2}
                  boxShadow={1}
                >
                  <Typography variant={'h3'} color={'#333'} textAlign={'center'} sx={{ fontFamily: 'Courier New, monospace', flex: 1 }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, justifyContent: 'center' }}>
                    <Inventory sx={{ color: '#00796b' }} />
                    <Typography variant={'h3'} color={'#333'} textAlign={'center'} sx={{ fontFamily: 'Courier New, monospace' }}>
                      {quantity}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={() => addItem(name)} startIcon={<Add />} sx={{ backgroundColor: '#388e3c', color: '#ffffff' }}>
                      Add
                    </Button>
                    <Button variant="contained" onClick={() => removeItem(name)} startIcon={<Remove />} sx={{ backgroundColor: '#d32f2f', color: '#ffffff' }}>
                      Remove
                    </Button>
                    <Button variant="contained" onClick={() => deleteItem(name)} startIcon={<Delete />} sx={{ backgroundColor: '#d32f2f', color: '#ffffff' }}>
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </>
      ) : (
        <Dialog open={!user} aria-labelledby="sign-in-dialog-title">
          <DialogTitle id="sign-in-dialog-title">Welcome</DialogTitle>
          <DialogContent sx={{ bgcolor: '#e0f7fa', textAlign: 'center' }}>
            <Typography variant="h6">Please sign in to manage inventory.</Typography>
            <Button variant="contained" onClick={signInWithGoogle} sx={{ mt: 2, backgroundColor: '#00796b', color: '#ffffff' }}>
              Sign in with Google
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}














