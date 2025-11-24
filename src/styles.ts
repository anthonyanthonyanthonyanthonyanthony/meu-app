import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },

  input: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 18,
    fontSize: 18,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  rememberText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#333",
  },

  button: {
    width: "60%",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    zIndex: 10,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  mensagem: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },

  centerWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  fixedContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    flexGrow: 0,
  },

  listaArea: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
  },

  imagem: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  infoContainer: {
    marginBottom: 12,
  },

  nomeLocal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },

  data: {
    fontSize: 14,
    color: "#666",
  },

  coords: {
    fontSize: 14,
    color: "#666",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  botaoEditar: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  botaoExcluir: {
    backgroundColor: "#ff3b30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
