import {
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import List from "@mui/material/List";
import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';

function DrawerComp() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const pages = ["Home", "Search", "Cart"];

  return (
    <React.Fragment>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List>
          {pages.map((page, index) => (
            <ListItemButton key={index}>
              <ListItemIcon>
                <ListItemText>{page}</ListItemText>
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        sx={{ marginLeft: "auto" }}
      >
        <MenuIcon style={{color: 'white'}}/>
      </IconButton>
    </React.Fragment>
  );
}

export default DrawerComp;
