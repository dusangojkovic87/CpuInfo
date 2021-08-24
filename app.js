const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const cpuModel = document.querySelector(".cpu__model");
  const cpuSpeed = document.querySelector(".cpu__speed");
  const cpuCoresNumber = document.querySelector(".cpu__cores__number");
  const cpuArch = document.querySelector(".cpu__arch");
  const ipAddress = document.querySelector(".ip__address");

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
    const results = [];
    for (const name of Object.keys(args)) {
      for (const net of args[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === "IPv4" && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results.push(net.address);
        }
      }

      ipAddress.innerHTML = `<span class='info__label'>ip address:</span>${results[0]}`;
    }
  });
});
