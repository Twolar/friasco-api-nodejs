import { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

const CustomHideShowFormGridToolbar = ({buttonName, buttonIcon, formToShow}) => {
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={buttonIcon}
        onClick={() => toggleFormVisibility()}
      >
        {isFormVisible ? "HIDE" : buttonName}
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      {isFormVisible && (
        <Box width="100%" mb="20px">
          {formToShow}
        </Box>
      )}
    </GridToolbarContainer>
  );
};

export default CustomHideShowFormGridToolbar;