import { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../../components/Header";
import CustomHideShowFormGridToolbar from "../../../components/CustomHideShowFormGridToolbar";
import AddIcon from "@mui/icons-material/Add";
import NewUserForm from "../../../components/NewUserForm";
import { fetchUsers, deleteUser } from "../../../data/api";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);

  const updateUserGrid = async () => {
    const fetchedUsers = await fetchUsers();

    // TODO: Implement proper user role functionality.
    fetchedUsers.forEach((user, index) => {
      if (index === 0) {
        user.access = "admin";
      } else {
        user.access = "user";
      }
    });

    setUsers(fetchedUsers);
  };

  useEffect(() => {
    updateUserGrid();
  }, []);

  const deleteUserRow = async (userId) => {
    const userDeletedSuccess = await deleteUser(userId);
    if (userDeletedSuccess) {
      updateUserGrid();
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 0"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "user" && <VerifiedUserOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => deleteUserRow(params.id)}
            style={{
              color: colors.redAccent[300],
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="0px 20px">
      <Header title="USERS" subtitle="Manage all users" />

      <Box
        width="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          slots={{
            toolbar: () => (
              <CustomHideShowFormGridToolbar
                buttonName="CREATE"
                buttonIcon={<AddIcon />}
                formToShow={<NewUserForm updateUserGrid={updateUserGrid} />}
              />
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default Users;
