import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { format, startOfWeek, addDays } from 'date-fns';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [reportType, setReportType] = useState(0);
  const [openReport, setOpenReport] = useState(false);
  const [selectedUser, setSelectedUser] = useState('all');

  const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  
  const getCurrentDayIndex = () => {
    const today = format(currentDay, 'EEEE');
    const englishDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return englishDays.indexOf(today);
  };

  const handleAddTask = () => {
    if (title && description && userName) {
      const newTask = {
        id: Date.now(),
        title,
        description,
        userName,
        date: new Date(),
        day: format(currentDay, 'EEEE'),
        timestamp: format(new Date(), 'dd.MM.yyyy HH:mm')
      };
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      setUserName('');
    }
  };

  const handleReportTypeChange = (event, newValue) => {
    setReportType(newValue);
  };

  const getUniqueUsers = () => {
    const users = tasks.map(task => task.userName);
    return ['all', ...new Set(users)];
  };

  const generateReport = () => {
    const now = new Date();
    let filteredTasks = [];

    // First filter by date range
    switch (reportType) {
      case 0: // Weekly
        const weekStart = startOfWeek(now);
        filteredTasks = tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate >= weekStart;
        });
        break;
      case 1: // Monthly
        filteredTasks = tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate.getMonth() === now.getMonth() &&
                 taskDate.getFullYear() === now.getFullYear();
        });
        break;
      case 2: // Yearly
        filteredTasks = tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate.getFullYear() === now.getFullYear();
        });
        break;
    }

    // Then filter by selected user
    if (selectedUser !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.userName === selectedUser);
    }

    return filteredTasks;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Günlük İş Takibi
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs
              value={getCurrentDayIndex()}
              onChange={(e, val) => setCurrentDay(addDays(startOfWeek(new Date()), val))}
              variant="fullWidth"
              sx={{ mb: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}
            >
              {weekDays.map((day) => (
                <Tab key={day} label={day} />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="İş Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Yapılacak işin başlığını giriniz"
              sx={{ bgcolor: '#ffffff' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="İş Açıklaması"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              placeholder="İş ile ilgili detaylı açıklama giriniz"
              sx={{ bgcolor: '#ffffff' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="İşi Giren Kişi"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Adınızı giriniz"
              sx={{ bgcolor: '#ffffff' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="İş Kayıt Tarihi ve Saati"
              value={format(new Date(), 'dd.MM.yyyy HH:mm')}
              disabled
              margin="normal"
              variant="outlined"
              sx={{ bgcolor: '#f5f5f5' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none'
              }}
            >
              İş Ekle
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Günün Görevleri
        </Typography>
        <List>
          {tasks
            .filter(task => task.day === format(currentDay, 'EEEE'))
            .map((task) => (
              <ListItem key={task.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                <ListItemText
                  primary={<>
                    {task.title}
                    <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                      {task.timestamp} - {task.userName}
                    </Typography>
                  </>}
                  secondary={task.description}
                />
              </ListItem>
            ))}
        </List>
        <Button
          variant="outlined"
          onClick={() => setOpenReport(true)}
          sx={{ mr: 2, mt: 2 }}
        >
          Rapor Görüntüle
        </Button>
      </Box>

      <Dialog open={openReport} onClose={() => setOpenReport(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Tabs value={reportType} onChange={handleReportTypeChange}>
                <Tab label="Haftalık Rapor" />
                <Tab label="Aylık Rapor" />
                <Tab label="Yıllık Rapor" />
              </Tabs>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kişi Seç</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  label="Kişi Seç"
                >
                  {getUniqueUsers().map((user) => (
                    <MenuItem key={user} value={user}>
                      {user === 'all' ? 'Tüm Kişiler' : user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <List>
            {generateReport().map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={<>
                    {task.title}
                    <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                      {task.timestamp}
                    </Typography>
                  </>}
                  secondary={`${task.description} - ${task.day} - ${task.userName}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReport(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskManager;