#!/usr/bin/env node
"use strict";

const AWS = require("aws-sdk");
const assert = require("assert");

assert(process.env.AWS_PROFILE, "AWS_PROFILE must be defined");
assert(process.env.AWS_REGION, "AWS_REGION must be defined");
assert(process.env.APP_HOSTNAME, "APP_HOSTNAME must be defined");

const route53 = new AWS.Route53({ region: "us-east-1" });
const domains = new AWS.Route53Domains({ region: "us-east-1" });

async function main(_argv) {

  const { HostedZones: zones } = await route53.listHostedZones().promise();
  const zone = zones.find( ({ Name }) => Name === `${process.env.APP_HOSTNAME}.` );

  assert(zone, "Hosed zone not found");

  const result = await route53.getHostedZone({ Id: zone.Id }).promise();
  const { DelegationSet } = result;

  assert(DelegationSet.NameServers.length === 4, "Name servers not found");

  const params = {
    DomainName: process.env.APP_HOSTNAME,
    Nameservers: DelegationSet.NameServers.map(Name => ({ Name }))
  };

  return domains.updateDomainNameservers(params).promise();
}

/**
 *
 * Connects the four Route53-provisioned name servers (delegation set) to the
 * actual name servers used by DNS.
 *
 * Required to make DNS lookups work and connect applications online.
 *
 */
main(process.argv)
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
