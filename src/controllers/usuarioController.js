import { response } from "express";
import { Usuario, Lancamentos } from "../database/models";
import tokenService from "../services/tokenService";
var bcrypt = require("bcryptjs");

export default {
  add: (req, res, next) => {
    try {
      Usuario.create(req.body)
        .then((response) => {
          res.status(201).json({ sucess: true, usuario: response });
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({
            error: error,
            sucess: false,
            message: "Ocorreu um erro enquanto os dados eram inseridos.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  update: (req, res, next) => {
    try {
      Usuario.findOne({ where: { id: req.params.id } })
        .then((usuario) => {
          if (usuario) {
            return usuario.update(req.body).then((response) => {
              res.status(200).json({ success: true, usuario: response });
            });
          } else {
            res.status(404).json({
              success: false,
              message: "O registro solicitado não foi encontrado no sistema.",
            });
          }
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram atualizados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  list: (req, res, next) => {
    try {
      Usuario.findAll({
        // order: ["nome"],
      })
        .then((response) => {
          res.status(200).json({ success: true, usuarios: response });
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  findById: (req, res, next) => {
    try {
      Usuario.findOne({ where: { id: req.params.id } })
        .then((response) => {
          if (response) {
            res.status(200).json({ success: true, usuario: response });
          } else {
            res.status(404).json({
              success: false,
              message: "O registro solicitado não foi encontrado no sistema.",
            });
          }
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto o dado era recuperado.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  login: (req, res, next) => {
    try {
      const usuario = req.body.usuario;
      const senha = bcrypt.hashSync(req.body.senha, 8);
      const token = tokenService.encode(
        usuario.id,
        usuario.usuario,
        usuario.senha
      );
      var passwordIsValid = bcrypt.compareSync(usuario.senha, senha);
      if (!passwordIsValid)
        return res.status(401).send({ message: "Senha Incorreta" });
      else res.status(200).json({ usuario, token });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },
};
