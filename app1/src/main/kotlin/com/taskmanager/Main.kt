package com.taskmanager

import javafx.application.Application
import javafx.scene.Scene
import javafx.scene.control.*
import javafx.scene.layout.*
import javafx.stage.Stage
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class TaskManagerApp : Application() {
    private val tasks = mutableListOf<Task>()
    private val weekDays = listOf("Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar")
    private var currentDay = LocalDate.now()

    override fun start(stage: Stage) {
        stage.title = "Görev Yöneticisi"

        val mainLayout = VBox(10.0)
        mainLayout.style = "-fx-padding: 20;"

        // Input fields
        val titleField = TextField().apply { promptText = "Görev Başlığı" }
        val descriptionField = TextArea().apply { 
            promptText = "Görev Açıklaması"
            prefRowCount = 3
        }
        val userNameField = TextField().apply { promptText = "Kullanıcı Adı" }

        // Add task button
        val addButton = Button("Görev Ekle").apply {
            setOnAction {
                if (titleField.text.isNotEmpty() && descriptionField.text.isNotEmpty() && userNameField.text.isNotEmpty()) {
                    val task = Task(
                        title = titleField.text,
                        description = descriptionField.text,
                        userName = userNameField.text,
                        date = currentDay,
                        timestamp = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"))
                    )
                    tasks.add(task)
                    updateTaskList()
                    
                    // Clear fields
                    titleField.clear()
                    descriptionField.clear()
                    userNameField.clear()
                }
            }
        }

        // Task list
        val taskListView = ListView<String>()
        
        fun updateTaskList() {
            taskListView.items.clear()
            tasks.forEach { task ->
                taskListView.items.add("${task.title} - ${task.userName} (${task.timestamp})")
            }
        }

        // Layout
        mainLayout.children.addAll(
            Label("Yeni Görev"),
            titleField,
            descriptionField,
            userNameField,
            addButton,
            Label("Görevler"),
            taskListView
        )

        stage.scene = Scene(mainLayout, 800.0, 600.0)
        stage.show()
    }
}

data class Task(
    val title: String,
    val description: String,
    val userName: String,
    val date: LocalDate,
    val timestamp: String
)

fun main() {
    Application.launch(TaskManagerApp::class.java)
}