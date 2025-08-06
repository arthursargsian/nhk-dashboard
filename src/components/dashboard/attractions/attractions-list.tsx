'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import { DialogActions } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';

import { useAttractions } from '@/hooks/use-attractions';

interface AttractionsListProps {
  onEdit: (item: any) => void;
}

export function AttractionsList({ onEdit }: AttractionsListProps): React.JSX.Element {
  const { items, isLoading, deleteItem } = useAttractions();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<any>(null);

  // Function to get placeholder image based on item ID
  const getPlaceholderImage = (id: number) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'];
    const color = colors[id % colors.length];
    // Create a simple SVG placeholder
    const svg = `
      <svg width="80" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="60" fill="${color}"/>
        <text x="40" y="35" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Attraction ${id}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'> = {
      religious: 'primary',
      cultural: 'secondary',
      historical: 'success',
      natural: 'info',
      entertainment: 'warning',
      other: 'default'
    };
    return colors[category] || 'default';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      religious: 'Религиозные',
      cultural: 'Культурные',
      historical: 'Исторические',
      natural: 'Природные',
      entertainment: 'Развлекательные',
      other: 'Другие'
    };
    return labels[category] || 'Другие';
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await deleteItem(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="text.secondary" variant="body1">
          Достопримечательности не найдены. Создайте первую достопримечательность, чтобы начать.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Изображение</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Местоположение</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Создана</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Card sx={{ width: 80, height: 60 }}>
                    <CardMedia
                      component="img"
                      image={item.image ? `http://localhost:3000${item.image}` : getPlaceholderImage(item.id)}
                      alt={item.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Card>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300 }}>
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCategoryLabel(item.category)}
                    size="small"
                    color={getCategoryColor(item.category)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      color="primary"
                    >
                      <PencilIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(item)}
                      color="error"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Удалить достопримечательность
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить "{itemToDelete?.title}"? Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 