const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const cpuModel = document.querySelector(".cpu__model");
  const cpuSpeed = document.querySelector(".cpu__speed");
  const cpuCoresNumber = document.querySelector(".cpu__cores__number");
  const cpuArch = document.querySelector(".cpu__arch");
  const cpuAdressContainer = document.querySelector(".cpu-adress-info");

  //call os info to main
  ipcRenderer.send("getOsInfo");
  ipcRenderer.send("getOsArch");
  ipcRenderer.send("getNetworkInterface");

  //os info reply from main
  ipcRenderer.once("replyOsData", (e, args) => {
    let cpuData = {
      model: args[0].model,
      speed: args[0].speed,
      cores: args.length,
    };

    if (cpuData != null) {
      cpuModel.innerHTML = `<span class='info__label'>Cpu model:</span> ${cpuData.model}`;
      cpuSpeed.innerHTML = `<span class='info__label'>Cpu speed:</span> ${cpuData.speed} Hz`;
      cpuCoresNumber.innerHTML = `<span class='info__label'>Cpu core number:</span> ${cpuData.cores}`;
    }
  });

  ipcRenderer.once("replyOsArch", (e, args) => {
    let cpuData = {
      arch: args,
    };

    if (cpuData != null) {
      cpuArch.innerHTML = `<span class='info__label'>Cpu arhitecture:</span> ${cpuData.arch}`;
    }
  });

  ipcRenderer.once("replyNetworkInterface", (e, args) => {
    if (args) {
      for (const netInfoName of Object.keys(args)) {
        for (const netInfo of args[netInfoName]) {

            //dodaj izlistavanje net adresa
          console.log(netInfo);
        }
      }
    }
  });
});
