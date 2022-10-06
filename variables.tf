variable "region" {
  type    = string
  default = "us-west-1"
}

variable "availability_zones" {
  type    = list
  default = ["us-west-1b", "us-west-1c"]
}

variable "container_definitions" {
  type    = list
  default = [
    {
      name  = "nginx"
      image = "nginx:stable"
    }
  ]
}